// src/activities/ActivitiesPage.jsx
import { useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useAuth } from "../auth/AuthContext";

function ActivityItem({ activity }) {
  const { token } = useAuth();
  const {
    mutate: deleteActivity,
    loading: deleteLoading,
    error: deleteError,
  } = useMutation("DELETE", `/activities/${activity.id}`, ["activities"]);

  return (
    <li style={{ marginBottom: "1rem" }}>
      <h3>{activity.name}</h3>
      <p>{activity.description}</p>

      {token && (
        <>
          <button
            onClick={() => deleteActivity()}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting…" : "Delete"}
          </button>
          {deleteError && <output role="alert">{deleteError}</output>}
        </>
      )}
    </li>
  );
}

export default function ActivitiesPage() {
  const { token } = useAuth();
  const {
    data,
    loading: loadingActivities,
    error: fetchError,
  } = useQuery("/activities", "activities");

  const {
    mutate: addActivity,
    loading: addLoading,
    error: addError,
  } = useMutation("POST", "/activities", ["activities"]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // ← handle plain-array vs { activities: [...] }
  const activities = Array.isArray(data)
    ? data
    : data?.activities || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    addActivity({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <>
      <h1>Activities</h1>

      {loadingActivities && <p>Loading activities…</p>}
      {fetchError && <output role="alert">{fetchError}</output>}

      {!loadingActivities && !fetchError && (
        <ul>
          {activities.map((act) => (
            <ActivityItem key={act.id} activity={act} />
          ))}
        </ul>
      )}

      {token && (
        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
          <h2>Add New Activity</h2>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <button disabled={addLoading}>
            {addLoading ? "Adding…" : "Add Activity"}
          </button>
          {addError && <output role="alert">{addError}</output>}
        </form>
      )}
    </>
  );
}
