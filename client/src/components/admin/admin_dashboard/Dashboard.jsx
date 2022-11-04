import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { tokenSelector } from '../../../features/user/userSlice'
import Loader from '../../Loader'
import { fetchAllProperties, deleteProperty } from '../adminApi'
import { ReactComponent as TrashIcon } from '../../../assets/icons/trash-can.svg'
import { Link } from 'react-router-dom'
const Dashboard = () => {
  const [status, setStatus] = useState('idle')
  let token = useSelector(tokenSelector)
  const [propertyIdToDelete, setPropertyIdToDelete] = useState(null)
  const properties = useRef([])
  useEffect(() => {
    const getAllProperties = async () => {
      if (token) {
        try {
          const response = await fetchAllProperties(token)
          properties.current = response
          setStatus('loaded')
        } catch (err) {
          setStatus('error')
        }
      }
    }

    getAllProperties()

    return () => {
      token = false
    }
  }, [token])
  if (status === 'error')
    return (
      <h2 className='text-center mt-4 text-danger'>
        Eroare. Incercati mai tarziu.
      </h2>
    )
  if (status !== 'loaded') return <Loader />

  const handleDeletePost = () => {
    deleteProperty(token, propertyIdToDelete)
    properties.current = properties.current.filter(
      p => p.id !== propertyIdToDelete
    )
    setPropertyIdToDelete(null)
  }
  return (
    <div className=''>
      <h1>Dashboard</h1>
      <div className='mt-5'>
        <h3>Anunturi</h3>
        <div className='row bg-dark text-white'>
          <div className='p-2 col-1 border-right border-white'>ID</div>
          <div className='p-2 col-1 border-right border-white'>999 ID</div>
          <div className='p-2 col-3 border-right border-white'>Titlul</div>
          <div className='p-2 col-3 border-right border-white'>Adresa</div>
          <div className='p-2 col-2 border-right border-white'>Agent</div>
          <div className='p-2 col-2'>Actiuni</div>
        </div>
        {properties.current.map(property => (
          <div key={property.id} className='row border-bottom'>
            <div className='p-2 col-1 border-right border-light'>
              {property.id}
            </div>
            <div className='p-2 col-1 border-right border-light'>
              {property.e999AdvertId}
            </div>
            <div className='p-2 col-3 border-right border-light'>
              {property.title}
            </div>
            <div className='p-2 col-3 border-right border-light'>
              {property && property.location && property.location.street
                ? `${property.location.street}${
                    property.location.houseNr
                      ? ` ${property.location.houseNr},`
                      : ''
                  }`
                : ' '}
              {`${property &&
                property.location &&
                property.location.sector.name}, ${property &&
                property.location &&
                property.location.city.name}`}
            </div>
            <div className='p-2 col-2 border-right border-light'>{`${property.user.givenName} ${property.user.familyName}`}</div>
            <div className='p-2 col-2'>
              <div className='d-flex justify-content-between'>
                <button
                  className='btn btn-danger py-1 px-3'
                  type='button'
                  data-toggle='modal'
                  data-target='#deletePropertyModal'
                  data-bs-toggle='modal'
                  data-bs-target='#deletePropertyModal'
                  onClick={() => setPropertyIdToDelete(property.id)}
                >
                  <TrashIcon height={16} width={16} />
                </button>

                <Link
                  className='btn btn-warning py-1 px-3'
                  type='button'
                  to={{
                    pathname: `/admin/edit/${property.id}`
                  }}
                >
                  {/* <TrashIcon height={16} width={16} /> */}
                  edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Molal */}
      <div
        className='modal fade'
        id='deletePropertyModal'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='deletePropertyModalLabel'
        aria-hidden='true'
        data-backdrop='static'
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='deletePropertyModalLabel'>
                Esti sigur ca vrei sa stergi anuntul?
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
                onClick={() => setPropertyIdToDelete(null)}
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              Stergere anuntul cu idul {propertyIdToDelete}. Anuntul va fi sters
              doar de pe topestate.md. Va ramane insa pe 999.md.
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
                onClick={() => setPropertyIdToDelete(null)}
              >
                Anuleaza
              </button>
              <button
                type='button'
                className='btn btn-danger'
                data-dismiss='modal'
                onClick={() => {
                  handleDeletePost()
                }}
              >
                Sterge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
