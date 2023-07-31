import React, { useEffect, useState } from "react";
import {
  database,
  push,
  ref,
  onValue,
  serverTimestamp,
} from "../../../constants/firebaseDB";
import moment from "moment/moment";
import "./Chatting.scss";
import { useNavigate, useParams } from "react-router";

export default function Chatting() {
  const params = useParams();
  const USER = JSON.parse(localStorage.getItem("USER_LOGIN"));
  const [messageList, setMessageList] = useState([]);
  const sendMessage = () => {
    let message = document.getElementById("message").value.trim();
    if (message.trim() != "") {
      push(ref(database, `class-${params.id}`), {
        name: `${USER.firstName} ${USER.lastName}`,
        message: message,
        userID: USER.accountID,
        roleID: USER.role.id,
        createdAt: moment(new Date()).format("DD-MM-YYYY, HH:mm"),
      });
    }
    document.getElementById("message").value = "";
  };

  const sendMessageEnter = (event) => {
    let message = document.getElementById("message").value.trim();
    if (event.which === 13) {
      if (message.trim() != "") {
        push(ref(database, `class-${params.id}`), {
          name: `${USER.firstName} ${USER.lastName}`,
          message: message,
          userID: USER.accountID,
          roleID: USER.role.id,
          createdAt: moment(new Date()).format("DD-MM-YYYY, HH:mm"),
        });
      }
      document.getElementById("message").value = "";
    }
  };

  useEffect(() => {
    onValue(ref(database, `class-${params.id}`), (data) => {
      let getMsg = [];
      data.forEach((d) => {
        getMsg.push(d.val());
      });
      setMessageList(getMsg);
    });
  }, []);
  console.log(messageList);
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="chat-detail">
        <div className="chat-detail__header flex justify-content-between">
          <div className="header__info">
            <span
              className="p-0 m-0"
              style={{ fontWeight: "bolder", fontSize: "18px" }}
            >
              Class: {params.className}
            </span>
          </div>
          <div className="flex justify-content-end mt-1 ms-3">
            <button
              className="border-0 bg-light text-black px-3 py-1"
              style={{ borderRadius: "10px" }}
              onClick={() => {
                if (USER.role.id == 3) {
                  navigate("/trainer/schedule");
                } else if (USER.role.id == 4) {
                  navigate("/trainee/schedule");
                }
              }}
            >
              Close
            </button>
          </div>
        </div>
        <div className="chat-detail__messages" id="messages">
          {messageList.map((item, index) => {
            let { createdAt, name, roleID, userID, message } = item;
            return (
              <div
                key={index}
                className={`message ${
                  parseInt(userID) == USER.accountID ? "me" : ""
                }`}
              >
                <div className="message__detail">
                  <div className="message__detail__text">
                    <div className="info">
                      {parseInt(userID) == USER.accountID ? "You" : name}
                      {roleID == 2 && !(parseInt(userID) == USER.accountID)
                        ? " - Assistant"
                        : ""}
                      {roleID == 3 && !(parseInt(userID) == USER.accountID)
                        ? " - Trainer"
                        : ""}
                      {roleID == 4 && !(parseInt(userID) == USER.accountID)
                        ? " - Trainee"
                        : ""}
                      <br></br>{" "}
                      {createdAt.split(",")[0].trim() ==
                      moment(new Date()).format("DD-MM-YYYY")
                        ? "Today"
                        : createdAt.split(",")[0].trim()}
                      {", "}
                      {createdAt.split(",")[1].trim()}
                    </div>
                    <div className="text">{message}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="chat-detail__input">
          <input
            type="text"
            placeholder="Type a message"
            id="message"
            onKeyDown={(event) => {
              sendMessageEnter(event);
            }}
          />
          <button
            onClick={() => {
              sendMessage();
            }}
            className="border-0 px-3 ms-2 bg-dark text-light"
            style={{ borderRadius: "10px" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
