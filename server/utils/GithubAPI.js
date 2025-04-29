import axios from 'axios';

/**
 * GitHub API utility for fetching repository data
 * This utility provides functions to interact with GitHub's REST API
 * to get information about repositories, commits, issues, and pull requests
 */

const GITHUB_API_URL = 'https://api.github.com';

/**
 * Extract owner and repo name from a GitHub repository URL
 * @param {string} repoUrl - The full GitHub repository URL
 * @returns {Object} An object containing owner and repo
 */
const parseGitHubUrl = (repoUrl) => {
  if (!repoUrl) return null;
  
  try {
    // Handle various GitHub URL formats
    const url = new URL(repoUrl);
    if (!url.hostname.includes('github.com')) return null;
    
    // Get path segments
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    
    if (pathSegments.length < 2) return null;
    
    return {
      owner: pathSegments[0],
      repo: pathSegments[1]
    };
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    return null;
  }
};

/**
 * Get repository information
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} [token] - Optional GitHub access token for private repos
 * @returns {Promise<Object>} Repository information
 */
export const getRepositoryInfo = async (repoUrl, token = null) => {
  const repoData = parseGitHubUrl(repoUrl);
  if (!repoData) throw new Error('Invalid GitHub repository URL');
  
  const { owner, repo } = repoData;
  
  try {
    const headers = { 
      'Accept': 'application/vnd.github.v3+json' 
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
      console.log('Using GitHub token for authentication');
    } else {
      console.log('No GitHub token provided, using unauthenticated access');
    }
    
    const requestUrl = `${GITHUB_API_URL}/repos/${owner}/${repo}`;
    console.log('GitHub API Request URL:', requestUrl);
    console.log('Request Headers:', JSON.stringify(headers, null, 2));
    
    const response = await axios.get(requestUrl, { headers });
    
    console.log('GitHub API Response Status:', response.status);
    console.log('GitHub API Response Headers:', JSON.stringify(response.headers, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error fetching repository info:', error);
    console.error('Error Message:', error.message);
    
    if (error.response) {
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    throw new Error('Failed to fetch repository information');
  }
};

/**
 * Get commit activity for a repository
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} [token] - Optional GitHub access token for private repos
 * @returns {Promise<Array>} Commit activity data
 */
export const getCommitActivity = async (repoUrl, token = null) => {
  const repoData = parseGitHubUrl(repoUrl);
  if (!repoData) throw new Error('Invalid GitHub repository URL');
  
  const { owner, repo } = repoData;
  
  try {
    const headers = { 
      'Accept': 'application/vnd.github.v3+json' 
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/stats/commit_activity`,
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching commit activity:', error);
    throw new Error('Failed to fetch commit activity');
  }
};

/**
 * Get open issues for a repository
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} [token] - Optional GitHub access token for private repos
 * @returns {Promise<Array>} Array of open issues
 */
export const getOpenIssues = async (repoUrl, token = null) => {
  const repoData = parseGitHubUrl(repoUrl);
  if (!repoData) throw new Error('Invalid GitHub repository URL');
  
  const { owner, repo } = repoData;
  
  try {
    const headers = { 
      'Accept': 'application/vnd.github.v3+json' 
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/issues`,
      { 
        headers,
        params: {
          state: 'open',
          per_page: 100
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching open issues:', error);
    throw new Error('Failed to fetch open issues');
  }
};

/**
 * Get pull requests for a repository
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} [token] - Optional GitHub access token for private repos
 * @returns {Promise<Array>} Array of pull requests
 */
export const getPullRequests = async (repoUrl, token = null) => {
  const repoData = parseGitHubUrl(repoUrl);
  if (!repoData) throw new Error('Invalid GitHub repository URL');
  
  const { owner, repo } = repoData;
  
  try {
    const headers = { 
      'Accept': 'application/vnd.github.v3+json' 
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/pulls`,
      { 
        headers,
        params: {
          state: 'open',
          per_page: 100
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    throw new Error('Failed to fetch pull requests');
  }
};

/**
 * Get contributor statistics for a repository
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} [token] - Optional GitHub access token for private repos
 * @returns {Promise<Array>} Array of contributor statistics
 */
export const getContributorStats = async (repoUrl, token = null) => {
  const repoData = parseGitHubUrl(repoUrl);
  if (!repoData) throw new Error('Invalid GitHub repository URL');
  
  const { owner, repo } = repoData;
  
  try {
    const headers = { 
      'Accept': 'application/vnd.github.v3+json' 
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/stats/contributors`,
      { headers }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching contributor stats:', error);
    throw new Error('Failed to fetch contributor statistics');
  }
};

/**
 * Gets a comprehensive stats object for a repository
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} [token] - Optional GitHub access token for private repos
 * @returns {Promise<Object>} Comprehensive stats
 */
export const getRepositoryStats = async (repoUrl, token = null) => {
  try {
    const repoInfo = await getRepositoryInfo(repoUrl, token);
    
    // Get collaborators count
    const collaboratorsResponse = await axios.get(
      `${GITHUB_API_URL}/repos/${repoInfo.owner.login}/${repoInfo.name}/collaborators`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(token && { 'Authorization': `token ${token}` })
        }
      }
    );
    
    // Get commit count (last year)
    const commitActivityResponse = await axios.get(
      `${GITHUB_API_URL}/repos/${repoInfo.owner.login}/${repoInfo.name}/stats/participation`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(token && { 'Authorization': `token ${token}` })
        }
      }
    );
    
    const totalCommits = commitActivityResponse.data.all.reduce((sum, week) => sum + week, 0);
    
    return {
      name: repoInfo.name,
      fullName: repoInfo.full_name,
      description: repoInfo.description,
      stars: repoInfo.stargazers_count,
      forks: repoInfo.forks_count,
      watchers: repoInfo.watchers_count,
      openIssuesCount: repoInfo.open_issues_count,
      language: repoInfo.language,
      createdAt: repoInfo.created_at,
      updatedAt: repoInfo.updated_at,
      collaborators: collaboratorsResponse.data.length,
      totalCommits: totalCommits,
    };
  } catch (error) {
    console.error('Error fetching repository stats:', error);
    throw new Error(`Failed to fetch repository statistics: ${error.message}`);
  }
};

/**
 * Gets repository activity summary with less detailed data
 * (more efficient for dashboard displays)
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} [token] - Optional GitHub access token for private repos
 * @returns {Promise<Object>} Activity summary
 */
export const getRepositoryActivitySummary = async (repoUrl, token = null) => {
  try {
    console.log('Fetching repository data for URL:', repoUrl);
    
    const repoData = parseGitHubUrl(repoUrl);
    console.log('Parsed repository data:', repoData);
    
    const repoInfo = await getRepositoryInfo(repoUrl, token);
    console.log('API response for repository info:', JSON.stringify(repoInfo, null, 2));
    
    // Skip fetching last commit SHA to reduce API calls
    // This can help prevent rate limiting issues
    
    const summary = {
      name: repoInfo.name,
      fullName: repoInfo.full_name,
      stars: repoInfo.stargazers_count,
      forks: repoInfo.forks_count,
      openIssuesCount: repoInfo.open_issues_count,
      language: repoInfo.language,
      updatedAt: repoInfo.updated_at,
      // Skip lastCommitSha to reduce API calls
    };
    
    console.log('Final repository summary:', JSON.stringify(summary, null, 2));
    return summary;
  } catch (error) {
    console.error('Error fetching repository activity summary:', error);
    console.error('Error details:', error.response ? JSON.stringify(error.response.data, null, 2) : 'No response data');
    throw new Error('Failed to fetch repository activity summary');
  }
};

/**
 * Get the latest commit SHA for a branch
 * @param {string} repoUrl - The GitHub repository URL
 * @param {string} branch - The branch name
 * @param {string} [token] - Optional GitHub access token for private repos
 * @returns {Promise<string>} The latest commit SHA
 */
export const getLastCommitSha = async (repoUrl, branch = 'main', token = null) => {
  const repoData = parseGitHubUrl(repoUrl);
  if (!repoData) throw new Error('Invalid GitHub repository URL');
  
  const { owner, repo } = repoData;
  
  try {
    const headers = { 
      'Accept': 'application/vnd.github.v3+json' 
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
      console.log('Using GitHub token for commit request');
    } else {
      console.log('No GitHub token provided for commit request');
    }
    
    const requestUrl = `${GITHUB_API_URL}/repos/${owner}/${repo}/commits/${branch}`;
    console.log('Last Commit Request URL:', requestUrl);
    
    const response = await axios.get(requestUrl, { headers });
    
    console.log('Commit API Response Status:', response.status);
    console.log('Last Commit Data:', JSON.stringify({
      sha: response.data.sha,
      author: response.data.commit?.author?.name,
      date: response.data.commit?.author?.date,
      message: response.data.commit?.message?.slice(0, 100) + (response.data.commit?.message?.length > 100 ? '...' : '')
    }, null, 2));
    
    return response.data.sha;
  } catch (error) {
    console.error('Error fetching last commit SHA:', error);
    
    if (error.response) {
      console.error('Commit Error Response Status:', error.response.status);
      console.error('Commit Error Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return null;
  }
};

export default {
  getRepositoryInfo,
  getLastCommitSha,
  getCommitActivity,
  getOpenIssues,
  getPullRequests,
  getContributorStats,
  getRepositoryStats,
  getRepositoryActivitySummary,
  parseGitHubUrl
};