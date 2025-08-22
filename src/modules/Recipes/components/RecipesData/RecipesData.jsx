import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import FileUploader from "../../../Shared/components/FileUploader/FileUploader"; // adjust path

/**
 * RecipesData Component
 * ----------------------
 * Handles both creating and updating recipes.
 *
 * Modes:
 * - "create" → POST new recipe
 * - "update" → PUT existing recipe (prefilled form with data)
 *
 * Props:
 * - mode (string): "create" or "update"
 */
function RecipesData({ mode }) {
  // ----------------------------
  // State
  // ----------------------------
  const [tagsList, setTagsList] = useState([]); // All available tags
  const [categoriesList, setCategoriesList] = useState([]); // All available categories
  const { id } = useParams(); // Recipe ID for update mode
  const navigate = useNavigate();

  // ----------------------------
  // 👇 Handle file selection from FileUploader
  const handleFileSelect = (file) => {
    setValue("recipeImage", file, { shouldValidate: true }); // update react-hook-form
  };

  //----------------------------
  // Form Hook
  // ----------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  /**
   * Helper: Build FormData object for submission.
   */
  function appendToFormData(data) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("categoriesIds", data.categoriesIds);
    formData.append("tagId", data.tagId);

    // Attach image if provided
    // Attach image if provided
    if (data.recipeImage) {
      formData.append("recipeImage", data.recipeImage);
    }

    return formData;
  }

  // ----------------------------
  // API Calls
  // ----------------------------

  /**
   * Fetch all categories (with pagination).
   */
  const getAllCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found in localStorage");

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

  /**
   * Fetch all tags.
   */
  const getAllTags = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found in localStorage");

      const res = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/tag/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTagsList(res.data || []);
    } catch (err) {
      console.error("Error fetching tags:", err.response?.data || err.message);
    }
  };

  /**
   * Fetch recipe details by ID (for update mode).
   */
  const getRecipeDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://upskilling-egypt.com:3006/api/v1/Recipe/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const recipe = res.data;

      // Prefill form with recipe data
      setValue("name", recipe.name);
      setValue("description", recipe.description);
      setValue("price", recipe.price);
      setValue("tagId", recipe.tag.id);
      setValue("categoriesIds", recipe.categories[0]?.id || "0");
    } catch (err) {
      console.error(
        "Error fetching recipe details:",
        err.response?.data || err.message
      );
    }
  };

  // ----------------------------
  // Submit Handler
  // ----------------------------
  const onSubmit = async (data) => {
    const formData = appendToFormData(data);
    const token = localStorage.getItem("token");

    try {
      let res;
      if (mode === "update") {
        // Update existing recipe
        res = await axios.put(
          `https://upskilling-egypt.com:3006/api/v1/Recipe/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Recipe updated successfully!");
      } else {
        // Create new recipe
        res = await axios.post(
          "https://upskilling-egypt.com:3006/api/v1/Recipe/",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Recipe created successfully!");
      }

      navigate("/dashboard/recipes"); // Redirect after success
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // ----------------------------
  // Lifecycle
  // ----------------------------
  useEffect(() => {
    getAllCategories();
    getAllTags();

    // Fetch recipe details if in update mode
    if (mode === "update" && id) {
      getRecipeDetails(id);
    }
  }, [id, mode]);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <>
      <Header
        imgPath={boyPhoto}
        title={`${mode === "update" ? "Update" : "Add"} Recipe`}
        desc={`You can now ${
          mode === "update" ? "update" : "add"
        } your items that any user can order from the Application.`}
      />

      <form className="container my-5 p-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Recipe Name */}
        <input
          {...register("name", { required: "Recipe name is required" })}
          type="text"
          className="form-control my-2"
          placeholder="Recipe Name"
        />
        {errors.name && (
          <span className="text-danger">{errors.name.message}</span>
        )}
        {/* Tags */}
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
        {/* Description */}
        <textarea
          className="form-control my-2"
          placeholder="Recipe Description"
          {...register("description", { required: "Description is required" })}
        ></textarea>
        {errors.description && (
          <span className="text-danger">{errors.description.message}</span>
        )}
        {/* Price */}
        <input
          {...register("price", { required: "Price is required" })}
          type="number"
          className="form-control my-2"
          placeholder="Recipe Price"
          min="0"
        />
        {errors.price && (
          <span className="text-danger">{errors.price.message}</span>
        )}
        {/* Categories */}
        <select
          className="form-control my-2"
          defaultValue=""
          {...register("categoriesIds", { required: "Category is required" })}
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
          <span className="text-danger">{errors.categoriesIds.message}</span>
        )}
        {/* Image Upload */}

        <Controller
          name="recipeImage"
          control={control}
          rules={{ required: "Image is required" }}
          render={({ field, fieldState }) => (
            <FileUploader
              onFileSelect={(file) => field.onChange(file)} // pass file to RHF
              error={fieldState.error}
            />
          )}
        />
        {/* Action Buttons */}
        <div className="btns d-flex justify-content-end my-2">
          <button type="submit" className="btn btn-success mx-2">
            {mode === "update" ? "Update" : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-outline-danger mx-2"
            onClick={() => navigate("/dashboard/recipes")}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default RecipesData;
