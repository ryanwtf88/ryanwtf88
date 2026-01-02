import { request } from "../common/http.js";
import { retryer } from "../common/retryer.js";

const GRAPHQL_QUERY = `
  query userInfo($login: String!) {
    user(login: $login) {
      createdAt
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

const fetcher = (variables, token) => {
  return request(
    {
      query: GRAPHQL_QUERY,
      variables,
    },
    {
      Authorization: `bearer ${token}`,
    },
  );
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

const calculateStreak = (data) => {
  const calendar = data.user.contributionsCollection.contributionCalendar;
  const weeks = calendar.weeks;
  const days = [];

  weeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      if (new Date(day.date) <= new Date()) {
        days.push(day);
      }
    });
  });

  days.sort((a, b) => new Date(a.date) - new Date(b.date));

  let currentStreak = 0;
  let longestStreak = 0;
  
  let tempStreak = 0;
  let tempStreakStart = null;
  
  let longestStreakStart = null;
  let longestStreakEnd = null;

  // Iterate to find longest streak
  days.forEach((day) => {
    if (day.contributionCount > 0) {
      if (tempStreak === 0) {
        tempStreakStart = day.date;
      }
      tempStreak++;
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStreakStart = tempStreakStart;
        // The streak ended yesterday relative to this 'day'
        // But simpler: the end date was the date of the previous element in 'days'
        // Since we are iterating, we can't easily access prev element without index.
      }
      tempStreak = 0;
      tempStreakStart = null;
    }
  });

  // Check end of iteration
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
    longestStreakStart = tempStreakStart;
  }

  // Refined Longest Streak Date Logic
  // Let's re-iterate with index to be precise about dates
  tempStreak = 0;
  longestStreak = 0;
  
  for (let i = 0; i < days.length; i++) {
    if (days[i].contributionCount > 0) {
        if (tempStreak === 0) {
            tempStreakStart = days[i].date;
        }
        tempStreak++;
        
        // If this is the last day and extends the streak
        if (i === days.length - 1) {
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
                longestStreakStart = tempStreakStart;
                longestStreakEnd = days[i].date;
            }
        }
    } else {
        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
            longestStreakStart = tempStreakStart;
            longestStreakEnd = days[i-1].date;
        }
        tempStreak = 0;
    }
  }

  // Calculate Current Streak
  const today = new Date().toISOString().split('T')[0];
  const reversedDays = [...days].reverse();
  
  let streakCount = 0;
  let currentStreakStart = null;
  let currentStreakEnd = null;

  for (const day of reversedDays) {
    if (day.contributionCount > 0) {
      if (streakCount === 0) {
          currentStreakEnd = day.date;
      }
      streakCount++;
      currentStreakStart = day.date; // Keep updating start date as we go back
    } else {
      if (day.date === today && streakCount === 0) {
        continue; 
      }
      break;
    }
  }
  currentStreak = streakCount;

  // Format Dates
  const firstContributionDate = days.length > 0 ? days[0].date : today;
  const lastContributionDate = days.length > 0 ? days[days.length - 1].date : today;
  
  const totalContributionsRange = `${formatDate(firstContributionDate)} - ${formatDate(lastContributionDate)}`;
  
  const currentStreakRange = currentStreak > 0 
      ? `${formatDate(currentStreakStart)} - ${formatDate(currentStreakEnd)}` 
      : "No current streak";
      
  const longestStreakRange = longestStreak > 0
      ? `${formatDate(longestStreakStart)} - ${formatDate(longestStreakEnd)}`
      : "No longest streak";

  return {
    totalContributions: calendar.totalContributions,
    currentStreak,
    longestStreak,
    totalContributionsRange,
    currentStreakRange,
    longestStreakRange
  };
};

export const fetchStreak = async (username) => {
  try {
    const res = await retryer(fetcher, { login: username });
    if (res.data && res.data.data) {
        return calculateStreak(res.data.data);
    }
    return {
        totalContributions: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalContributionsRange: "",
        currentStreakRange: "",
        longestStreakRange: ""
    };
  } catch (err) {
      console.error("Error fetching streak:", err);
      return {
          totalContributions: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalContributionsRange: "",
          currentStreakRange: "",
          longestStreakRange: ""
      };
  }
};
