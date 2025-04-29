const TeamDisplay = ({ team, currentUser, onLeaveTeam }) => {
  const isLeader = team.leader.id === currentUser.id;
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{team.name}</h2>
            {team.description && (
              <p className="text-zinc-400">{team.description}</p>
            )}
          </div>
          <div className="bg-zinc-800 rounded-lg px-4 py-2 flex items-center space-x-2 border border-zinc-700">
            <span className="text-sm text-zinc-400">Team Code:</span>
            <span className="font-mono text-white font-bold">{team.code}</span>
            <button 
              className="text-zinc-500 hover:text-white"
              onClick={() => navigator.clipboard.writeText(team.code)}
              title="Copy team code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-zinc-500 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Created {team.createdAt.toLocaleDateString()}
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team Members
          </h3>
          <span className="text-sm font-medium px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full">
            {team.members.length}/4 Members
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.members.map(member => (
            <div key={member.id} className="flex items-center px-4 py-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-grow">
                <div className="flex items-center">
                  <p className="text-white font-medium">{member.name}</p>
                  {member.id === currentUser.id && (
                    <span className="ml-2 text-xs bg-zinc-700 px-2 py-1 rounded-full text-zinc-300">You</span>
                  )}
                </div>
                {member.id === team.leader.id && (
                  <span className="text-xs text-blue-400 flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Team Leader
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {Array(4 - team.members.length).fill(0).map((_, index) => (
            <div key={`empty-${index}`} className="px-4 py-3 bg-zinc-800/30 rounded-lg border border-dashed border-zinc-700 flex items-center">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-zinc-500">Available Slot</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-6 border-t border-zinc-800 flex justify-between items-center">
        <div className="text-sm text-zinc-500">
          {isLeader ? 
            "As team leader, disbanding will remove the team for all members." : 
            "You can leave this team at any time."
          }
        </div>
        <button
          onClick={onLeaveTeam}
          className={`px-4 py-2 text-sm rounded-lg transition flex items-center ${
            isLeader ? 
            "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-900/50" : 
            "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isLeader ? "Disband Team" : "Leave Team"}
        </button>
      </div>
    </div>
  );
};

export default TeamDisplay;