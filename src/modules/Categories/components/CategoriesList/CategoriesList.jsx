/**
 * CategoriesList Component
 * -------------------------
 * This component handles CRUD operations for categories:
 *  - Fetch categories from API
 *  - Add a new category
 *  - Update an existing category
 *  - Delete a category
 *
 * Features:
 *  - Uses `react-bootstrap` for UI components
 *  - Uses `react-hook-form` for form validation
 *  - Integrates with `axios` for API calls
 *  - Shows loading state, empty data state, and toast notifications
 */

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// UI components
import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// Custom components
import NoData from "../../../Shared/components/NoData/NoData";
import DeleteConfirmation from "../../../Shared/components/DeleteConfirmation/DeleteConfirmation";

function CategoriesList() {
  /** ---------------------- State Management ---------------------- */

  // Categories data
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected category for update/delete
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Delete modal state
  const [showDelete, setShowDelete] = useState(false);

  // Add modal state
  const [showAdd, setShowAdd] = useState(false);

  // Update modal state
  const [showUpdate, setShowUpdate] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  /** ---------------------- Modal Handlers ---------------------- */

  // Delete modal
  const handleCloseDelete = () => {
    setShowDelete(false);
    setSelectedCategoryId(null);
  };
  const handleShowDelete = (id) => {
    setSelectedCategoryId(id);
    setShowDelete(true);
  };

  // Add modal
  const handleCloseAdd = () => {
    setShowAdd(false);
    reset();
  };
  const handleShowAdd = () => setShowAdd(true);

  // Update modal
  const handleCloseUpdate = () => {
    setShowUpdate(false);
    setSelectedCategoryId(null);
    reset();
  };
  const handleShowUpdate = (category) => {
    setSelectedCategoryId(category.id);
    setValue("name", category.name); // Prefill form
    setShowUpdate(true);
  };

  /** ---------------------- API Calls ---------------------- */

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/Category/",
        {
          params: { pageSize: 5, pageNumber: 1 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data || err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(
        `https://upskilling-egypt.com:3006/api/v1/Category/${selectedCategoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCategories();
      handleCloseDelete();
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting category");
    }
  };

  // Add category
  const onSubmitAdd = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Category/",
        { name: data.name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCategories();
      toast.success(res.data.message || "Category created successfully!");
      reset();
      handleCloseAdd();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating category");
    }
  };

  // Update category
  const onSubmitUpdate = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.put(
        `https://upskilling-egypt.com:3006/api/v1/Category/${selectedCategoryId}`,
        { name: data.name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCategories();
      toast.success(res.data.message || "Category updated successfully!");
      reset();
      handleCloseUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating category");
    }
  };

  /** ---------------------- Lifecycle ---------------------- */
  useEffect(() => {
    fetchCategories();
  }, []);

  /** ---------------------- Render ---------------------- */
  return (
    <div className="vh-100">
      {/* Page Header */}
      <Header
        imgPath={boyPhoto}
        title={"Categories item"}
        desc={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
      />

      {/* Add Button */}
      <div className="container-fluid mb-4">
        <div className="add-button-container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h2 className="mb-1 fw-bold">Categories Table Details</h2>
            <p className="mb-0 text-muted">
              Manage your categories — add, update, or delete them as needed.
            </p>
          </div>
          <Button
            variant="primary"
            className="bg-success fw-semibold"
            onClick={handleShowAdd}
          >
            Add New Category
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="custom-table text-center">
        {loading ? (
          <Spinner animation="border" variant="primary" className="mt-5" />
        ) : categories.length === 0 ? (
          <NoData message="No categories found" />
        ) : (
          <Table striped bordered hover responsive>
            <thead className="no-border">
              <tr>
                <th>Name</th>
                <th>Creation Date</th>
                <th>Modification Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{new Date(category.creationDate).toLocaleString()}</td>
                  <td>
                    {new Date(category.modificationDate).toLocaleString()}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowUpdate(category)}
                    >
                      Update
                    </Button>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleShowDelete(category.id)}
                      title="Delete Category"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* ---------------------- Delete Modal ---------------------- */}
      <Modal show={showDelete} onHide={handleCloseDelete} centered>
        <Modal.Header closeButton />
        <Modal.Body>
          <DeleteConfirmation deleteItem="category" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------------- Add Modal ---------------------- */}
      <Modal show={showAdd} onHide={handleCloseAdd} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmitAdd)}>
            <div className="input-group my-3">
              <input
                {...register("name", { required: "Category name is required" })}
                type="text"
                className="form-control"
                placeholder="Category Name"
              />
            </div>
            {errors.name && (
              <span className="text-danger">{errors.name.message}</span>
            )}

            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="secondary"
                onClick={handleCloseAdd}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Save
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* ---------------------- Update Modal ---------------------- */}
      <Modal show={showUpdate} onHide={handleCloseUpdate} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmitUpdate)}>
            <div className="input-group my-3">
              <input
                {...register("name", { required: "Category name is required" })}
                type="text"
                className="form-control"
                placeholder="Category Name"
              />
            </div>
            {errors.name && (
              <span className="text-danger">{errors.name.message}</span>
            )}

            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="secondary"
                onClick={handleCloseUpdate}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CategoriesList;
