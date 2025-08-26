/**
 * FavsList.jsx
 * -----------------
 * Component to manage user's favourite recipes: view, unfavourite.
 * - Fetches favourites from API and displays them in a grid of cards.
 * - Allows removing a recipe from favourites.
 * - Uses axios for API communication.
 */

import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// UI Libraries
import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";
import Button from "react-bootstrap/Button";
import { Dropdown, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Pagination from "react-bootstrap/Pagination";

// Custom Components
import DeleteConfirmation from "../../../Shared/components/DeleteConfirmation/DeleteConfirmation";
import NoData from "../../../Shared/components/NoData/NoData";

function FavsList() {
  // ============================
  // State Management
  // ============================
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFavId, setSelectedFavId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // ============================
  // Handlers - Modals
  // ============================
  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedFavId(null);
  };

  const handleShowDelete = (id) => {
    setSelectedFavId(id);
    setShowDeleteModal(true);
  };

  // ============================
  // API Calls
  // ============================
  const fetchFavs = async (page = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found in localStorage");

    setLoading(true);
    try {
      const res = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/userRecipe/",
        {
          params: { pageSize: 5, pageNumber: page },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFavs(res.data.data || []);

      if (res.data.totalNumberOfPages) {
        setTotalPages(res.data.totalNumberOfPages);
      } else if (res.data.totalNumberOfRecords) {
        setTotalPages(Math.ceil(res.data.totalNumberOfRecords / 5));
      }
    } catch (err) {
      console.error("Error fetching favourites:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfavourite = async () => {
    if (!selectedFavId) {
      toast.error("No favourite selected");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return toast.error("No token found in localStorage");

    setDeleting(true);

    // compute remaining items *before* we mutate state
    const remainingAfterDelete = favs.filter(
      (f) => f.id !== selectedFavId
    ).length;

    try {
      // optimistic UI update
      setFavs((prev) => prev.filter((f) => f.id !== selectedFavId));

      await axios.delete(
        `https://upskilling-egypt.com:3006/api/v1/userRecipe/${selectedFavId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Removed from favourites!");
      handleCloseDelete();

      // if page is now empty and not the first page → go back a page
      if (remainingAfterDelete === 0 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        // otherwise refresh current page to stay in sync with server
        fetchFavs(currentPage);
      }
    } catch (error) {
      // revert by refetching if API fails
      fetchFavs(currentPage);
      toast.error(error.response?.data?.message || "Error removing favourite");
      console.error(
        "Error removing favourite:",
        error.response?.data || error.message
      );
    } finally {
      setDeleting(false);
    }
  };

  const CustomToggle = forwardRef(({ onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ cursor: "pointer" }}
    >
      <FontAwesomeIcon icon={faEllipsisV} />
    </span>
  ));

  // ============================
  // Lifecycle
  // ============================
  useEffect(() => {
    fetchFavs(currentPage);
  }, [currentPage]);

  // ============================
  // Render
  // ============================
  return (
    <div
      className="min-vh-100 d-flex flex-column overflow-hidden"
      style={{ overflowX: "hidden", overflowY: "auto" }}
    >
      {/* Page Header */}
      <Header
        imgPath={boyPhoto}
        title="My Favourites"
        desc="Here are all the recipes you’ve marked as favourites."
      />

      <div className="container-fluid flex-grow-1 overflow-auto mb-4">
        <h2 className="mb-1 fw-bold">Favourites</h2>
        <p className="mb-0 text-muted">
          You can view your favourite recipes here and remove them if you like.
        </p>

        {/* Favourites Grid */}
        <div className=" text-center">
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : favs.length === 0 ? (
            <NoData message="No favourites found" />
          ) : (
            <div className="row g-4">
              {favs.map(({ id, recipe }) => {
                const {
                  id: recipeId,
                  name,
                  imagePath,
                  price,
                  category,
                  tag,
                } = recipe;

                return (
                  <div key={id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card h-100 shadow-sm">
                      {imagePath ? (
                        <img
                          src={`https://upskilling-egypt.com:3006/${imagePath}`}
                          className="card-img-top"
                          alt={name}
                          style={{
                            height: "180px",
                            objectFit: "cover",
                            width: "100%",
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center bg-light"
                          style={{ height: "180px", width: "100%" }}
                        >
                          No Image
                        </div>
                      )}

                      <div className="card-body d-flex flex-column">
                        <h5
                          className="card-title text-truncate"
                          title={name}
                          style={{ maxWidth: "100%" }}
                        >
                          {name}
                        </h5>
                        <p className="card-text mb-1">💲 {price}</p>
                        <p className="card-text mb-1">
                          Category: {category?.[0]?.name || "No Category"}
                        </p>
                        <p className="card-text text-muted">
                          Tag: {tag?.name || "No Tag"}
                        </p>

                        <div className="mt-auto d-flex justify-content-between">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              navigate(`/dashboard/recipes-view/${recipeId}`)
                            }
                          >
                            <FontAwesomeIcon icon={faEye} className="me-1" />
                            View
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleShowDelete(id)} // id = favourite.id ✅
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            {Array(totalPages)
              .fill(null)
              .map((_, index) => {
                const page = index + 1;
                return (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                );
              })}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </Pagination>
          {/* Delete Confirmation Modal */}
          <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <DeleteConfirmation deleteItem="recipe" />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                onClick={handleUnfavourite}
                disabled={deleting}
              >
                Yes, Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default FavsList;
