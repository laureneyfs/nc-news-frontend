import { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { fetchAllUsers } from "../api/api";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";

function Login() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      navigate(-1, { replace: true });
    }
  }, [loggedInUser, navigate]);

  useEffect(() => {
    setLoadingUsers(true);
    fetchAllUsers()
      .then((data) => {
        setUsers(data.users.slice(0, 3));
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  }, []);

  const handleLogin = (user) => {
    setLoggedInUser(user);
    navigate(-1);
  };
  if (loggedInUser) return null;

  return (
    <>
      <h2 class="content-descriptor">Choose user to log in as</h2>
      <>{loadingUsers && <Loading field={"users..."} />}</>
      <section className="user-wrapper">
        {loggedInUser && (
          <section className="user-profile">
            <Error message={`Already logged in as: ${loggedInUser.username}`} />
            <button
              onClick={() => {
                setLoggedInUser(null);
              }}
            >
              Log Out
            </button>
          </section>
        )}
        {!loadingUsers &&
          !loggedInUser &&
          users.map((user) => (
            <section
              key={user.username}
              className="user-profile clickable"
              onClick={() => handleLogin(user)}
            >
              <img
                className="user-avatar"
                src={user.avatar_url}
                alt={user.username}
              />
              <div className="login-fields">
                <h3>{user.username}</h3>
              </div>
            </section>
          ))}
      </section>
    </>
  );
}

export default Login;
