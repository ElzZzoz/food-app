/**
 * RecipesList.jsx
 * -----------------
 * Component to manage recipes: view, update, and delete.
 * - Fetches recipes from API and displays them in a table.
 * - Provides modals for update and delete actions.
 * - Integrates with react-hook-form for handling updates.
 * - Uses axios for API communication.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// UI Libraries
import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// Custom Components
import DeleteConfirmation from "../../../Shared/components/DeleteConfirmation/DeleteConfirmation";
import NoData from "../../../Shared/components/NoData/NoData";

function RecipesList() {
  // ============================
  // State Management
  // ============================
  const [recipes, setRecipes] = useState([]); // list of recipes
  const [loading, setLoading] = useState(false); // loading spinner
  const [showDeleteModal, setShowDeleteModal] = useState(false); // delete modal
  const [showUpdateModal, setShowUpdateModal] = useState(false); // update modal
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); // currently selected recipe id
  const [tagsList, setTagsList] = useState([]); // tags dropdown list
  const [categoriesList, setCategoriesList] = useState([]); // categories dropdown list

  const navigate = useNavigate();

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // ============================
  // Handlers - Modals
  // ============================
  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setSelectedRecipeId(null);
  };

  const handleShowDelete = (id) => {
    setSelectedRecipeId(id);
    setShowDeleteModal(true);
  };

  const handleCloseUpdate = () => setShowUpdateModal(false);

  const handleShowUpdate = (id) => {
    setSelectedRecipeId(id);
    setShowUpdateModal(true);
  };

  // ============================
  // API Calls
  // ============================

  /**
   * Fetch all recipes (with pagination by default: page 1, size 5).
   */
  const fetchRecipes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found in localStorage");

    setLoading(true);
    try {
      const res = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/Recipe",
        {
          params: { pageSize: 5, pageNumber: 1 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecipes(res.data.data || []);
    } catch (err) {
      console.error("Error fetching recipes:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a recipe by ID.
   */
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found in localStorage");

    try {
      await axios.delete(
        `https://upskilling-egypt.com:3006/api/v1/Recipe/${selectedRecipeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRecipes(); // refresh list
      handleCloseDelete();
    } catch (error) {
      console.error(
        "Error deleting recipe:",
        error.response?.data || error.message
      );
    }
  };

  /**
   * Update recipe details using PUT request with FormData.
   */
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("No token found in localStorage");

      // prepare formData for image upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("tagId", data.tagId);
      formData.append("categoriesIds", data.categoriesIds);
      if (data.recipeImage && data.recipeImage[0]) {
        formData.append("recipeImage", data.recipeImage[0]);
      }

      const res = await axios.put(
        `https://upskilling-egypt.com:3006/api/v1/Recipe/${selectedRecipeId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchRecipes(); // refresh after update
      toast.success(res.data.message || "Recipe updated successfully!");
      reset();
      handleCloseUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating recipe");
      console.error(
        "Error updating recipe:",
        err.response?.data || err.message
      );
    }
  };

  /**
   * Get all tags (used in update form dropdown).
   */
  const getAllTags = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found in localStorage");

    try {
      const res = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/tag/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTagsList(res.data);
    } catch (err) {
      console.error("Error fetching tags:", err.response?.data || err.message);
    }
  };

  /**
   * Get all categories (used in update form dropdown).
   */
  const getAllCategories = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found in localStorage");

    try {
      const res = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/Category/",
        {
          params: { pageSize: 5, pageNumber: 1 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategoriesList(res.data.data || []);
    } catch (err) {
      console.error(
        "Error fetching categories:",
        err.response?.data || err.message
      );
    }
  };

  // ============================
  // Lifecycle
  // ============================
  useEffect(() => {
    fetchRecipes();
    getAllTags();
    getAllCategories();
  }, []);

  // ============================
  // Render
  // ============================
  return (
    <div className="vh-100">
      {/* Page Header */}
      <Header
        imgPath={boyPhoto}
        title="Recipes List"
        desc="You can now add your recipes for users to view, order, or edit."
      />

      {/* Section Title + Add Button */}
      <div className="container-fluid mb-4">
        <div className="add-button-container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h2 className="mb-1 fw-bold">Recipes Table Details</h2>
            <p className="mb-0 text-muted">
              Manage your recipes — add, update, or delete them as needed.
            </p>
          </div>
          <Button
            variant="primary"
            className="bg-success fw-semibold"
            onClick={() => navigate("/dashboard/recipes-data")}
          >
            Add New Recipe
          </Button>
        </div>
      </div>

      {/* Recipes Table */}
      <div className="custom-table text-center">
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : recipes.length === 0 ? (
          <NoData message="No recipes found" />
        ) : (
          <Table striped bordered hover responsive>
            <thead className="no-border">
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Price</th>
                <th>Category</th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map(({ id, name, imagePath, price, tag, category }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>
                    {imagePath ? (
                      <img
                        src={`https://upskilling-egypt.com:3006/${imagePath}`}
                        alt={name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{price}</td>
                  <td>
                    {category?.length > 0 ? category[0].name : "No Category"}
                  </td>
                  <td>{tag?.name || "No Tag"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowUpdate(id)}
                    >
                      Update
                    </Button>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleShowDelete(id)}
                      title="Delete Recipe"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <DeleteConfirmation deleteItem="recipe" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Update Recipe Modal */}
        <Modal show={showUpdateModal} onHide={handleCloseUpdate} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div className="mb-2">
                <input
                  {...register("name", { required: "Recipe name is required" })}
                  type="text"
                  className="form-control"
                  placeholder="Recipe Name"
                />
                {errors.name && (
                  <span className="text-danger">{errors.name.message}</span>
                )}
              </div>

              {/* Description */}
              <div className="mb-2">
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="form-control"
                  placeholder="Recipe Description"
                />
                {errors.description && (
                  <span className="text-danger">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-2">
                <input
                  {...register("price", { required: "Price is required" })}
                  type="number"
                  className="form-control"
                  placeholder="Price"
                />
                {errors.price && (
                  <span className="text-danger">{errors.price.message}</span>
                )}
              </div>

              {/* Tags */}
              <div className="mb-2">
                <select
                  className="form-control my-2"
                  defaultValue=""
                  {...register("tagId", { required: "Tag is required" })}
                >
                  <option value="" disabled>
                    -- Select Tag --
                  </option>
                  {tagsList.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                {errors.tagId && (
                  <span className="text-danger">{errors.tagId.message}</span>
                )}
              </div>

              {/* Categories */}
              <div className="mb-2">
                <select
                  className="form-control my-2"
                  defaultValue=""
                  {...register("categoriesIds", {
                    required: "Category is required",
                  })}
                >
                  <option value="" disabled>
                    -- Select Category --
                  </option>
                  <option value="0">No Category</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoriesIds && (
                  <span className="text-danger">
                    {errors.categoriesIds.message}
                  </span>
                )}
              </div>

              {/* Image Upload */}
              <div className="mb-2">
                <input
                  {...register("recipeImage")}
                  type="file"
                  className="form-control"
                  accept="image/*"
                />
              </div>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseUpdate}>
                  Cancel
                </Button>
                <Button type="submit" variant="success">
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default RecipesList;
