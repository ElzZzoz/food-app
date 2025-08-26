import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Card, Badge, Button } from "react-bootstrap";
import { usersApi } from "../../../../services/urls/urls";
import { faArrowLeft, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UsersData = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await usersApi.getById(id);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <Spinner animation="border" />;

  if (!user) return <p>No user data found.</p>;

  return (
    <div className="container mt-4">
      {/* 👇 Back button */}
      <Button
        variant="secondary"
        className="mb-3 d-flex align-items-center gap-2"
        onClick={() => navigate("/dashboard/users")}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to Users
      </Button>

      <Card className="p-4 shadow">
        <div className="d-flex align-items-center gap-3">
          {user.imagePath ? (
            <img
              src={`https://upskilling-egypt.com:3006/${user.imagePath.replace(
                /^\/?/,
                ""
              )}`}
              alt={user.userName}
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              size="5x"
              style={{ color: "#ccc" }}
              title="No photo"
            />
          )}

          <div>
            <h3 className="fw-bold">{user.userName}</h3>
            <p className="text-muted">{user.email}</p>
          </div>
        </div>

        <hr />

        <div>
          <p>
            <strong>Phone:</strong> {user.phoneNumber || "N/A"}
          </p>
          <p>
            <strong>Country:</strong> {user.country || "N/A"}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            <Badge
              bg={user.group?.name === "SuperAdmin" ? "danger" : "primary"}
            >
              {user.group?.name || "User"}
            </Badge>
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge bg={user.isVerified ? "success" : "warning"}>
              {user.isVerified ? "Verified" : "Pending"}
            </Badge>
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(user.creationDate).toLocaleString()}
          </p>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default UsersData;
