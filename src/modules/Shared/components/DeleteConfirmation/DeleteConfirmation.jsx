import deleteGirl from "../../../../assets/images/DeleteGirl.svg";

function DeleteConfirmation({ deleteItem }) {
  return (
    <>
      <div className="text-center">
        <img src={deleteGirl} alt="delete" className="mb-5" />
        <h5>Delete This {deleteItem}?</h5>
        <p>
          Are you sure you want to delete this {deleteItem}? This action cannot
          be undone.
        </p>
      </div>
    </>
  );
}

export default DeleteConfirmation;
