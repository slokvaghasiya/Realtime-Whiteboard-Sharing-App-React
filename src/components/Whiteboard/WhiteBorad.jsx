import React, { useEffect, useState } from "react";
import { useLayoutEffect } from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

const WhiteBorad = ({ canvasRef, ctxRef, elements, setElements, color, tool, user, socket }) => {

  const [isDrawing, setIsDrawing] = useState(false);
  const [img, setImg] = useState(null);

  useEffect(() => {
    socket.on("whiteboardDataResponse", (data) => {
      setImg(data.imageURL)
    })
  }, [img])

  useEffect(() => {
    if (user?.presenter) {
      const canvas = canvasRef.current;
      canvas.height = window.innerHeight * 0.7;
      canvas.width = window.innerWidth * 2;
      const ctx = canvas.getContext("2d");
      ctxRef.current = ctx;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round"
    }
  }, []);

  useEffect(() => {
    if (user?.presenter) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color])

  useLayoutEffect(() => {
    if (user?.presenter) {
      if (canvasRef) {
        const roughCanvas = rough.canvas(canvasRef.current);

        if (elements.length > 0) {
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height,);
        }
        elements.forEach((element) => {
          if (element.type === "rect") {
            roughCanvas.draw(
              roughGenerator.rectangle(element.offsetX, element.offsetY, element.width, element.height, { stroke: element.stroke, strokeWidth: 5, roughness: 0 })
            );
          } else if (element.type === "pencil") {
            roughCanvas.linearPath(element.path, { stroke: element.stroke, strokeWidth: 5, roughness: 0 });
          } else if (element.type === "line") {
            roughCanvas.draw(
              roughGenerator.line(element.offsetX, element.offsetY, element.width, element.height, { stroke: element.stroke, strokeWidth: 5, roughness: 0 })
            );
          }
          else if (element.type === "circle") {
            roughCanvas.draw(
              roughGenerator.circle(element.offsetX, element.offsetY, element.diameter, { stroke: element.stroke, strokeWidth: 5, roughness: 0 })
            );
          }
        });
        const canvasImg = canvasRef.current.toDataURL();
        socket.emit("whiteboardData", canvasImg)
      }
    }
  }, [elements]);


  // Logic For Joining Users 
  if (!user?.presenter) {
    return (

      <div className="border border-dark bg-white border-3 h-100 w-100 overflow-hidden">
        <img src={img} alt="Wait....White board will share by Host !" style={{ height: window.innerHeight * 0.7, width: "285%" }} />
      </div>
    )
  };

  // On Mouse-Down Function
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements, { type: "pencil", offsetX, offsetY, path: [[offsetX, offsetY]], stroke: color, },
      ]);
    } else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements, { type: "line", offsetX, offsetY, width: offsetX, height: offsetY, stroke: color, },
      ]);
    } else if (tool === "rect") {
      setElements((prevElements) => [
        ...prevElements, { type: "rect", offsetX, offsetY, width: offsetX, height: offsetY, stroke: color, },
      ]);
    } else if (tool === "circle") {
      setElements((prevElements) => [
        ...prevElements, { type: "circle", offsetX, offsetY, endPosX: offsetX, endPosY: offsetY, diameter: 0, stroke: color, },
      ]);
    }
    setIsDrawing(true);
  };

  // On Mouse-Move Function
  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];

        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return { ...ele, path: newPath, };
            }
            else {
              return ele;
            }
          })
        );
      }
      else if (tool === "line") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return { ...ele, width: offsetX, height: offsetY };
            }
            else {
              return ele;
            }
          })
        );
      } else if (tool === "rect") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return { ...ele, width: offsetX - ele.offsetX, height: offsetY - ele.offsetY };
            } else {
              return ele;
            }
          })
        );
      }
      else if (tool === "circle") {
        setElements((prevElements) =>
        prevElements.map((ele, index) => {
            let diameter = Math.sqrt(Math.pow(offsetX - ele.offsetX, 2) + Math.pow(offsetY - ele.offsetY, 2)) * 2
            if (index === elements.length - 1) {
              return { ...ele, endPosX: offsetX - ele.offsetX, endPosY: offsetY - ele.offsetY,diameter:diameter };
            } else {
              return ele;
            }
          })
        );
        // setEndPos({ x, y });
        // setDiameter(Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)) * 2);
      };
    }
  };

  // On Mouse-Up Function
  const handleMouseUp = (e) => {
    setIsDrawing(false);
  };

  return (
    <div
      className="border bg-white border-dark border-3 h-100 w-100 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WhiteBorad;
