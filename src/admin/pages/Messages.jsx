import {
  useEffect,
  useState,
} from "react";

import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
  FaTimes,
} from "react-icons/fa";

import MessageTable from "../components/MessageTable";

import {
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from "../../services/messageService";

import "../styles/Messages.css";
import "../styles/MessageModal.css";


function Messages() {

  const [messages, setMessages] = useState([]);

  const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================
  // GET TOKEN
  // ==========================

  const getToken = () => {

    return (
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken")
    );

  };


  // ==========================
  // LOAD MESSAGES
  // ==========================

  const loadMessages = async () => {

    try {

      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {

        setError(
          "Authentication token not found."
        );

        return;

      }

      const data =
        await getMessages(token);

      setMessages(
        data.messages || []
      );

    } catch (err) {

      console.error(
        "Load messages error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load messages."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================
  // LOAD ON PAGE OPEN
  // ==========================

  useEffect(() => {

    loadMessages();

  }, []);


  // ==========================
  // VIEW MESSAGE
  // ==========================

  const handleView = async (message) => {

    setSelectedMessage(message);

    // Automatically mark New message as Read
    if (message.status === "New") {

      try {

        const token = getToken();

        await updateMessageStatus(
          message._id,
          "Read",
          token
        );

        setMessages((previous) =>
          previous.map((item) =>
            item._id === message._id
              ? {
                  ...item,
                  status: "Read",
                }
              : item
          )
        );

        setSelectedMessage((previous) => ({
          ...previous,
          status: "Read",
        }));

      } catch (err) {

        console.error(
          "Update status error:",
          err
        );

      }

    }

  };


  // ==========================
  // CHANGE STATUS
  // ==========================

  const handleStatusChange = async (
    status
  ) => {

    if (!selectedMessage) {
      return;
    }

    try {

      const token = getToken();

      const data =
        await updateMessageStatus(
          selectedMessage._id,
          status,
          token
        );

      const updatedMessage =
        data.data;

      setMessages((previous) =>
        previous.map((item) =>
          item._id ===
          updatedMessage._id
            ? updatedMessage
            : item
        )
      );

      setSelectedMessage(
        updatedMessage
      );

    } catch (err) {

      console.error(
        "Status update error:",
        err
      );

    }

  };


  // ==========================
  // DELETE MESSAGE
  // ==========================

  const handleDelete = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this message?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const token = getToken();

      await deleteMessage(
        id,
        token
      );

      setMessages((previous) =>
        previous.filter(
          (message) =>
            message._id !== id
        )
      );

      if (
        selectedMessage?._id === id
      ) {

        setSelectedMessage(null);

      }

    } catch (err) {

      console.error(
        "Delete message error:",
        err
      );

      alert(
        err.response?.data?.message ||
        "Unable to delete message."
      );

    }

  };


  // ==========================
  // STATISTICS
  // ==========================

  const totalMessages =
    messages.length;

  const newMessages =
    messages.filter(
      (message) =>
        message.status === "New"
    ).length;

  const readMessages =
    messages.filter(
      (message) =>
        message.status === "Read"
    ).length;

  const repliedMessages =
    messages.filter(
      (message) =>
        message.status === "Replied"
    ).length;


  return (

    <div className="messages-page">

      {/* ==========================
          PAGE HEADER
      ========================== */}

      <div className="messages-header">

        <div>

          <h1>
            Messages
          </h1>

          <p>
            Manage messages received
            from your portfolio.
          </p>

        </div>

        <button
          className="refresh-messages-btn"
          onClick={loadMessages}
        >
          Refresh
        </button>

      </div>


      {/* ==========================
          STATISTICS
      ========================== */}

      <div className="message-stats">

        <div className="message-stat-card">

          <div className="stat-icon">
            <FaEnvelope />
          </div>

          <div>
            <span>
              Total Messages
            </span>

            <strong>
              {totalMessages}
            </strong>
          </div>

        </div>


        <div className="message-stat-card">

          <div className="stat-icon new">
            <FaEnvelope />
          </div>

          <div>
            <span>
              New
            </span>

            <strong>
              {newMessages}
            </strong>
          </div>

        </div>


        <div className="message-stat-card">

          <div className="stat-icon read">
            <FaEnvelopeOpen />
          </div>

          <div>
            <span>
              Read
            </span>

            <strong>
              {readMessages}
            </strong>
          </div>

        </div>


        <div className="message-stat-card">

          <div className="stat-icon replied">
            <FaReply />
          </div>

          <div>
            <span>
              Replied
            </span>

            <strong>
              {repliedMessages}
            </strong>
          </div>

        </div>

      </div>


      {/* ==========================
          ERROR
      ========================== */}

      {error && (

        <div className="messages-error">
          {error}
        </div>

      )}


      {/* ==========================
          LOADING
      ========================== */}

      {loading ? (

        <div className="messages-loading">
          Loading messages...
        </div>

      ) : (

        <MessageTable
          messages={messages}
          onView={handleView}
          onDelete={handleDelete}
        />

      )}


      {/* ==========================
          MESSAGE MODAL
      ========================== */}

      {selectedMessage && (

        <div className="message-modal-overlay">

          <div className="message-modal">

            <div className="message-modal-header">

              <div>

                <h2>
                  {selectedMessage.subject}
                </h2>

                <span>
                  From {selectedMessage.name}
                </span>

              </div>

              <button
                className="close-message-btn"
                onClick={() =>
                  setSelectedMessage(null)
                }
              >
                <FaTimes />
              </button>

            </div>


            <div className="message-modal-body">

              <div className="message-information">

                <div>
                  <strong>
                    Name
                  </strong>

                  <span>
                    {selectedMessage.name}
                  </span>
                </div>

                <div>
                  <strong>
                    Email
                  </strong>

                  <span>
                    {selectedMessage.email}
                  </span>
                </div>

                <div>
                  <strong>
                    Phone
                  </strong>

                  <span>
                    {selectedMessage.phone ||
                      "Not provided"}
                  </span>
                </div>

                <div>
                  <strong>
                    Date
                  </strong>

                  <span>
                    {new Date(
                      selectedMessage.createdAt
                    ).toLocaleString()}
                  </span>
                </div>

              </div>


              <div className="message-content">

                <h3>
                  Message
                </h3>

                <p>
                  {selectedMessage.message}
                </p>

              </div>


              <div className="message-status-controls">

                <span>
                  Status:
                </span>

                <button
                  className={
                    selectedMessage.status ===
                    "New"
                      ? "active-status"
                      : ""
                  }
                  onClick={() =>
                    handleStatusChange(
                      "New"
                    )
                  }
                >
                  New
                </button>

                <button
                  className={
                    selectedMessage.status ===
                    "Read"
                      ? "active-status"
                      : ""
                  }
                  onClick={() =>
                    handleStatusChange(
                      "Read"
                    )
                  }
                >
                  Read
                </button>

                <button
                  className={
                    selectedMessage.status ===
                    "Replied"
                      ? "active-status"
                      : ""
                  }
                  onClick={() =>
                    handleStatusChange(
                      "Replied"
                    )
                  }
                >
                  Replied
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default Messages;