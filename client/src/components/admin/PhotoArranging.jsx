import React from "react";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Loader from "../Loader";
import { ReactComponent as DeleteIcon } from "../../assets/icons/trash-can.svg";
const imagesPerRow = Math.ceil((window.innerWidth - 700) / 160);
const PhotoArranging = ({ photoList, setPhotoList, deletePhoto }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const _rows = [];
    let _row = [];
    for (let i = 0; i < photoList.length; i++) {
      const p = photoList[i];
      _row.push(p);
      if ((i + 1) % imagesPerRow === 0) {
        _rows.push(_row);
        _row = [];
      }
    }
    if (_row.length) _rows.push(_row);
    setRows(_rows);
  }, [photoList]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { destination, source } = result;
    let newOrder;

    if (destination.droppableId === "delete") {
      const row = rows[+source.droppableId];
      const copiedItems = [...row];
      const [deleted] = copiedItems.splice(source.index, 1);
      const newRows = [...rows];
      deletePhoto(deleted);
      newOrder = [];
      newRows[+source.droppableId] = copiedItems;
      for (let i = 1; i < newRows.length; i++) {
        if (newRows[i - 1].length < imagesPerRow) {
          const [firstImage] = newRows[i].splice(0, 1);
          newRows[i - 1].push(firstImage);
        } else if (newRows[i - 1].length > imagesPerRow) {
          const [firstImage] = newRows[i - 1].splice(imagesPerRow, 1);
          newRows[i].splice(0, 0, firstImage);
        }
        newOrder.push(...newRows[i - 1]);
      }
      newOrder.push(...newRows[newRows.length - 1]);
      setRows(newRows);
    } else if (source.droppableId === destination.droppableId) {
      const row = rows[+source.droppableId];
      const copiedItems = [...row];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      const newRows = [...rows];
      newRows[+source.droppableId] = copiedItems;
      newOrder = [];
      for (let i = 0; i < newRows.length; i++) {
        const row = newRows[i];
        newOrder.push(...row);
      }
      setRows(newRows);
    } else {
      const sourceRow = rows[+source.droppableId];
      const sourceItems = [...sourceRow];
      const [removed] = sourceItems.splice(source.index, 1);

      const destinationRow = rows[+destination.droppableId];
      const destinationItems = [...destinationRow];
      destinationItems.splice(destination.index, 0, removed);

      const newRows = [...rows];
      newRows[+source.droppableId] = sourceItems;
      newRows[+destination.droppableId] = destinationItems;
      newOrder = [...newRows[0]];
      for (let i = 1; i < newRows.length; i++) {
        newOrder.push(...newRows[i]);
        if (newRows[i - 1].length < imagesPerRow) {
          const [firstImage] = newRows[i].splice(0, 1);
          newRows[i - 1].push(firstImage);
        } else if (newRows[i - 1].length > imagesPerRow) {
          const [firstImage] = newRows[i - 1].splice(imagesPerRow, 1);
          newRows[i].splice(0, 0, firstImage);
        }
      }
      setRows(newRows);
    }
    setPhotoList(newOrder);
  };

  if (!rows.length) return <Loader />;
  return (
    <div className="mt-3">
      <div
        className="d-flex flex-column justify-content-center"
        style={{ height: (rows.length + 0.5) * 100 }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="delete" direction="horizontal">
            {(provided, snapshot) => {
              return (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mt-n5 mb-2 ml-auto position-relative"
                  style={{
                    // width: 100,
                    padding: 30,
                    background: snapshot.isDraggingOver ? "#f5473b" : "#800a00",
                  }}
                >
                  {snapshot.isDraggingOver ? (
                    <></>
                  ) : (
                    <DeleteIcon
                      width="20"
                      height="20"
                      className="position-absolute"
                      style={{
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
          {rows.map((row, i) => {
            return (
              <Droppable droppableId={`${i}`} key={i} direction="horizontal">
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="d-flex w-100 h-100"
                      style={{
                        padding: 5,
                        background: snapshot.isDraggingOver
                          ? "#f0edff"
                          : "#f9f9f9",
                      }}
                    >
                      {row.map((pId, i) => {
                        return (
                          <Draggable
                            key={pId.id}
                            draggableId={"" + pId.id}
                            index={i}
                          >
                            {(provided, snapshot) => {
                              return (
                                <img
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    height: 90,
                                    userSelect: "none",
                                    objectFit: "contain",
                                    transition: "0.3s",
                                    ...provided.draggableProps.style,
                                  }}
                                  className="mr-3"
                                  src={
                                    typeof pId.id !== "string"
                                      ? `https://i.simpalsmedia.com/999.md/BoardImages/320x240/${pId.url}`
                                      : pId.url
                                  }
                                  alt=""
                                />
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default PhotoArranging;
