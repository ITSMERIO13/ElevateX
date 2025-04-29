import React, { useState } from 'react';
import axios from 'axios';
import OtherContext from './OtherContext';

const OtherState = (props) => {
  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5500";

  const [projects, setProjects] = useState([]);
  const [comments, setComments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const viewProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend}/api/projects`);
      setProjects(res.data);
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const getProjectById = async (projectId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend}/api/projects/${projectId}`);
      return res.data;
    } catch (err) {
      setError("Failed to fetch project details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (projectId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend}/api/comments/${projectId}`);
      setComments(res.data);
    } catch (err) {
      setError("Failed to fetch comments");
    }finally{
      setLoading(false);
    }
  };

  const postComment = async ({ projectId, text, userName,userEmail, profilePic }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backend}/api/comments`, {
        projectId,
        userName,
        profilePic,
        text,
        userEmail,
      });
      fetchComments(projectId);
      return res.data;
    } catch (err) {
      setError("Failed to post comment");
    }
    finally{
      setLoading(false);
    }
  };

  const deleteComment = async (commentId, projectId) => {
    setLoading(true);
    try {
      await axios.delete(`${backend}/api/comments/${commentId}`);
      // update local state
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      fetchComments(projectId); // optional if you want fresh fetch
    } catch (err) {
      setError("Failed to delete comment");
    }finally{
      setLoading(false);
    }
  };

  const fetchAllTeams = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend}/api/team`);
      // console.log(res.data);
      
      setTeams(res.data);
    } catch (err) {
      setError("Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };




  return (
    <OtherContext.Provider value={{
      viewProjects,
      projects,
      getProjectById,
      loading,
      error,
      comments,
      fetchComments,
      postComment,
      deleteComment, 
      fetchAllTeams,
      teams
    }}>
      {props.children}
    </OtherContext.Provider>
  );
};

export default OtherState;
