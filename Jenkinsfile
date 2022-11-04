def notifyBuild(channel, String buildStatus = 'STARTED') {
  buildStatus = buildStatus ?: 'SUCCESS'
  def colorCode = '#FF0000'
  def subject = "Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
  def summary = "${buildStatus}: <${env.BUILD_URL}|${subject}>"

  if (buildStatus == 'STARTED') {
    colorCode = '#ffc400'
  } else if (buildStatus == 'SUCCESS') {
    colorCode = '#43a047'
  } else {
    colorCode = '#e64a19'
  }
  slackNotify(channel, colorCode, summary)
}

def slackNotify(channel, color, message) {
  build job: 'notify-slack', parameters: [
    [$class: 'StringParameterValue', name: 'channel', value: channel],
    [$class: 'StringParameterValue', name: 'color', value: color],
    [$class: 'StringParameterValue', name: 'message', value: message]
  ]
}

def kubeDeploy(deployment, image, tag, namespace) {
  sh("kubectl set image deployments/${deployment} ${deployment}=${image}:${tag} -n ${namespace}")
}

def dockerLogin(command) {
  withCredentials([usernamePassword(credentialsId: 'itech-jenkins-docker', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_EMAIL')])
    {
      sh(command)
    }
  }   

timeout(time: 20, unit: 'MINUTES') {
  node {
    env.ENV = 'local'
    def appName = 'topestate'
    def gitCommit = '$(git rev-parse HEAD)'
    def branchName = env.BRANCH_NAME
    def topestateImage = 'gitlab.dev.itech.md:5050/itech/topestate/app'
    def notifyChannel = "#topestate-notify"
    properties([gitLabConnection('itech-gitlab'), disableConcurrentBuilds()])
    wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'gnome-terminal']) {

    try {
    notifyBuild(notifyChannel, 'STARTED')
    checkout scm
    dockerLogin("make -C . login") //requred login to docker repo backend/frontend

    stage ('Build/Push App') {
      println "Build and Push App"
      sh("tar cvzf ./.npm-cache.tgz --files-from /dev/null")
      sh("VERSION=${gitCommit} make -C . build")
      sh("VERSION=${gitCommit} make -C . push")
    }

    stage('Deploy') {
      switch (env.BRANCH_NAME) {
      case "master":
        sh("kubectl config use-context itech-prod02")
        kubeDeploy("topestate-app", topestateImage, gitCommit, "topestate-prod")
        sh("kubectl rollout status deployments/topestate-app -n topestate-prod --watch=true --timeout=600s")
        sh("kubectl get pods -n topestate-prod")
      break;
      default:
        sh("echo Continuous deployment is only enabled on the master branch")
      }
    }
  }
  catch (e) {
      // If there was an exception thrown, the build failed
      currentBuild.result = "FAILED"
      // deleteImage(topestateImage, gitCommit)
      throw e
    } 
  finally {
      // Success or failure, always send notifications
      notifyBuild(notifyChannel, currentBuild.result)
    }
  }
}
}
