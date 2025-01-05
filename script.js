import {
  ITEMS_PER_PAGE,
  formatCurrency,
  initializeTheme,
  toggleTheme
} from './utils.js';

let currentPage = 1;
let projectsData = [];

async function fetchProjects() {
  try {
    const response = await fetch('frontend-assignment.json');

    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
    }

    // Show loading state while data is being processed
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center;">
          Loading projects...
        </td>
      </tr>
    `;

    projectsData = await response.json();
    displayProjects(currentPage);
    setupPagination();
  } catch (error) {
    console.error('Error fetching data:', error);

    document.getElementById('table-body').innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: var(--text-color);">
          <p style="color: red;">Error loading projects</p>
          <p style="font-size: 0.9em;">${error.message}</p>
          <button onclick="window.location.reload()" style="margin-top: 10px; padding: 5px 10px;">
            Try Again
          </button>
        </td>
      </tr>
    `;
  }
}

function displayProjects(page) {
  const tableBody = document.getElementById('table-body');
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projectsData.slice(startIndex, endIndex);

  // Generate table rows with accessibility attributes
  tableBody.innerHTML = currentProjects.map(project => `
    <tr role="row">
      <td role="cell">${project['s.no']}</td>
      <td role="cell" aria-label="Percentage Funded">${project['percentage.funded']}%</td>
      <td role="cell" aria-label="Amount Pledged" class="currency-${project.currency.toLowerCase()}">
        ${formatCurrency(project['amt.pledged'], project.currency)}
      </td>
    </tr>
  `).join('');

  // Update table aria-live to announce new content
  document.getElementById('projects-table').setAttribute('aria-live', 'polite');
}

function setupPagination() {
  const totalPages = Math.ceil(projectsData.length / ITEMS_PER_PAGE);
  const paginationContainer = document.getElementById('pagination');

  // Generate pagination controls with accessibility attributes
  let paginationHTML = `
    <button 
      data-page="${currentPage - 1}" 
      ${currentPage === 1 ? 'disabled' : ''} 
      aria-label="Previous page"
    >
      Previous
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationHTML += `
        <button 
          data-page="${i}" 
          class="${i === currentPage ? 'active' : ''}"
          aria-label="Page ${i}"
          aria-current="${i === currentPage ? 'page' : 'false'}"
        >
          ${i}
        </button>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML += '<button disabled>...</button>';
    }
  }

  paginationHTML += `
    <button 
      data-page="${currentPage + 1}" 
      ${currentPage === totalPages ? 'disabled' : ''} 
      aria-label="Next page"
    >
      Next
    </button>
  `;

  // Announce page changes to screen readers
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('class', 'sr-only');
  liveRegion.textContent = `Showing page ${currentPage} of ${totalPages}`;
  paginationContainer.appendChild(liveRegion);

  paginationContainer.innerHTML = paginationHTML;

  // Add click event listeners to pagination buttons
  paginationContainer.querySelectorAll('button:not([disabled])').forEach(button => {
    button.addEventListener('click', () => {
      const page = parseInt(button.dataset.page);
      changePage(page);
    });
  });
}

const changePage = (page) => {
  if (page < 1 || page > Math.ceil(projectsData.length / ITEMS_PER_PAGE)) {
    return;
  }

  currentPage = page;
  displayProjects(currentPage);
  setupPagination();
}


// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  fetchProjects();

  // Add theme toggle event listener
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});
