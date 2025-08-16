import Header from "../../../Shared/components/Header/Header";
import boyPhoto from "../../../../assets/images/BoyPhoto.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function RecipesData() {
  const [tagsList, setTagsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const navigate = useNavigate();

  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function appendToFormData(data) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("categoriesIds", data.categoriesIds);
    formData.append("tagId", data.tagId);
    formData.append("recipeImage", data.recipeImage[0]);
    return formData;
  }

  const onSubmit = async (data) => {
    let recipeData = appendToFormData(data);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      let res = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Recipe/",
        recipeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", res.data);

      // ✅ Show success toast
      toast.success(res.data.message || "Recipe created successfully!");

      // ✅ Navigate after a short delay so user can see the toast
      setTimeout(() => {
        navigate("/dashboard/recipes");
      }, 1500);
    } catch (err) {
      console.error(
        "Error creating recipe:",
        err.response?.data || err.message
      );

      // ❌ Show error toast
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const getAllCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const res = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/Category/",
        {
          // If you want pagination
          params: { pageSize: 5, pageNumber: 1 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", res.data);
      setCategoriesList(res.data.data);
      // Destructure and default
    } catch (err) {
      console.error(
        "Error fetching recipes:",
        err.response?.data || err.message
      );
    }
  };

  const getAllTags = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const res = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/tag/",
        {
          // If you want pagination
          // params: { pageSize: 5, pageNumber: 1 },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", res.data);
      setTagsList(res.data);
    } catch (err) {
      console.error(
        "Error fetching recipes:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllTags();
  }, []);

  // console.log("Recipes Data:", recipes);
  console.log("Categories List:", categoriesList);
  console.log("Tags List:", tagsList);

  return (
    <>
      <Header
        imgPath={boyPhoto}
        title={"Recipe items!"}
        desc={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
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

        {/* Tags Select */}
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

        {/* Price Input */}
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

        {/* Categories Select */}
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
        <input
          {...register("recipeImage", { required: "Image is required" })}
          type="file"
          className="form-control my-2"
        />
        {errors.recipeImage && (
          <span className="text-danger">{errors.recipeImage.message}</span>
        )}

        {/* Buttons */}
        <div className="btns d-flex justify-content-end my-2">
          <button type="submit" className="btn btn-success mx-2">
            Save
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
