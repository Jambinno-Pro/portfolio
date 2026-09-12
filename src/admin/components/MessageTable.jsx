import {
  FaEye,
  FaTrash,
} from "react-icons/fa";

import "../styles/MessageTable.css";

function MessageTable({
  messages,
  onView,
  onDelete,
}) {

  return (

    <div className="messages-table-wrapper">

      <table className="messages-table">

        <thead>

          <tr>

            <th>Name</th>

            <th>Email</th>

            <th>Subject</th>

            <th>Status</th>

            <th>Date</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {messages.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="no-messages"
              >
                No messages found.
              </td>

            </tr>

          ) : (

            messages.map((message) => (

              <tr
                key={message._id}
                className={
                  message.status === "New"
                    ? "message-new"
                    : ""
                }
              >

                <td>

                  <strong>
                    {message.name}
                  </strong>

                </td>

                <td>
                  {message.email}
                </td>

                <td>
                  {message.subject}
                </td>

                <td>

                  <span
                    className={`message-status status-${message.status.toLowerCase()}`}
                  >
                    {message.status}
                  </span>

                </td>

                <td>

                  {message.createdAt
                    ? new Date(
                        message.createdAt
                      ).toLocaleDateString()
                    : "-"
                  }

                </td>

                <td>

                  <div className="message-actions">

                    <button
                      className="view-message-btn"
                      onClick={() =>
                        onView(message)
                      }
                      title="View Message"
                    >
                      <FaEye />
                    </button>

                    <button
                      className="delete-message-btn"
                      onClick={() =>
                        onDelete(message._id)
                      }
                      title="Delete Message"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );
}

export default MessageTable;