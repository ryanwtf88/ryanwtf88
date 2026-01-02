import { Card } from "../common/Card.js";
import { getCardColors } from "../common/color.js";
import { flexLayout } from "../common/render.js";

export const renderStreakCard = (streakData, options = {}) => {
  const {
    width = 495,
    height = 195,
    theme = "default",
    title_color,
    text_color,
    icon_color,
    bg_color,
    border_color,
    border_radius,
  } = options;

  const colors = getCardColors({
    title_color,
    text_color,
    icon_color,
    bg_color,
    border_color,
    theme,
  });

  const card = new Card({
    width,
    height,
    border_radius,
    colors,
    customTitle: "GitHub Streak",
  });

  const { 
      totalContributions, 
      currentStreak, 
      longestStreak, 
      totalContributionsRange, 
      currentStreakRange, 
      longestStreakRange 
  } = streakData;

  // Custom CSS for animations
  // Using slideInFade to avoid conflict with default fadeInAnimation
  const css = `
    .stat {
      font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
    }
    .stat-value {
      font: 700 28px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: ${colors.titleColor};
    }
    .stat-label {
      font: 400 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: ${colors.textColor};
    }
    .stat-date {
      font: 400 12px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: ${colors.textColor};
      opacity: 0.7;
    }
    .stagger {
      opacity: 0;
      animation: slideInFade 0.5s ease-in-out forwards;
    }
    .fire-icon {
        animation: firePulse 2s ease-in-out infinite alternate;
        display: block;
    }
    @keyframes firePulse {
        from { transform: scale(1); }
        to { transform: scale(1.1); }
    }
    @keyframes slideInFade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  card.setCSS(css);

  // Icons
  const betterFireIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
        <path fill="#e25822" d="M9.504.43a1.516 1.516 0 0 1 2.437 1.713c-1.025.984-1.738 2.527-1.738 4.607 0 2.597 2.126 4.966 4.795 4.966.36 0 .714-.04 1.048-.11a.498.498 0 0 1 .596.586 3.978 3.978 0 0 1-3.69 3.308 4.02 4.02 0 0 1-3.83-1.928.5.5 0 0 0-.877.054A5.96 5.96 0 0 1 1 12a6 6 0 0 1 5.955-6c.306 0 .605.025.9.073a.499.499 0 0 0 .598-.558c-.162-.977-.046-2.03.45-2.955.333-.619.957-1.127 1.601-1.13Z"></path>
    </svg>
  `;
  
  const createStat = (label, value, dateRange, index, isFire = false) => {
     const center = 82.5;
     const delay = (index + 1) * 200;
     const baseY = 48;
     const labelY = baseY + 24;
     const dateY = labelY + 24;

     return `
        <g class="stagger" style="animation-delay: ${delay}ms">
           <text x="${center}" y="${baseY}" text-anchor="middle" class="stat-value">
              ${value}
           </text>
           <text x="${center}" y="${labelY}" text-anchor="middle" class="stat-label">
               ${label}
           </text>
           ${isFire ? `
             <g transform="translate(${center + 45}, ${labelY - 12})">
               <g class="fire-icon">
                 ${betterFireIcon}
               </g>
             </g>
           ` : ''}
           <text x="${center}" y="${dateY}" text-anchor="middle" class="stat-date">
               ${dateRange}
           </text>
        </g>
     `;
  };
  const columns = flexLayout({
    items: [
      createStat("Total Contributions", totalContributions, totalContributionsRange, 0),
      `<line x1="0" y1="5" x2="0" y2="105" stroke="${colors.borderColor}" stroke-width="1" />`,
      createStat("Current Streak", currentStreak, currentStreakRange, 1, true),
      `<line x1="0" y1="5" x2="0" y2="105" stroke="${colors.borderColor}" stroke-width="1" />`,
      createStat("Longest Streak", longestStreak, longestStreakRange, 2),
    ],
    gap: 0,
    sizes: [165, 0, 165, 0, 165],
  }).join("");
  
  return card.render(columns);
};
