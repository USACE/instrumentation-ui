import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";

export default forwardRef(({ item, onSave }, ref) => {
  const [username, setUsername] = useState((item && item.userName) || "");
  const [email, setEmail] = useState((item && item.email) || "");
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (!username || !email) {
      setErrors("Username and Email are requred");
    } else {
      setErrors(null);
    }
  }, [username, email, setErrors]);

  const handleSave = () => {
    if (!errors) {
      onSave({
        id: (item && item.id) || null,
        username,
        email,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    save: () => {
      handleSave();
    },
  }));

  return (
    <form id="instrument-group-form" onSubmit={handleSave}>
      <div className="form-group">
        <label>Username</label>
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="form-control"
          type="text"
          placeholder="Text input"
        />
      </div>
      <div className="form-group">
        <label>E-Mail Address</label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="form-control"
          type="text"
          placeholder="Text input"
        />
      </div>
      <small className="text-danger">{errors}</small>
    </form>
  );
});
