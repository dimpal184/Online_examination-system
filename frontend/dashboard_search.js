// dashboard_search.js

document.addEventListener('DOMContentLoaded', () => {
    // Get the search input element using its new ID
    const searchInput = document.getElementById('search-input');
    // Get the container that holds your list of examinations
    const examListContainer = document.getElementById('exam-list');
    
    // Check to ensure both elements exist before proceeding
    if (searchInput && examListContainer) {
        // Add an event listener that triggers every time a key is released
        searchInput.addEventListener('keyup', (event) => {
            // Get the current value from the search bar and convert it to lowercase
            const searchTerm = event.target.value.toLowerCase();
            
            // Get all the individual examination items
            const examItems = examListContainer.querySelectorAll('.exam-item');

            examItems.forEach(item => {
                // Get the text from the examination's title and convert to lowercase for case-insensitive searching
                const title = item.getAttribute('data-title').toLowerCase();
                
                // Determine if the title includes the search term
                const isMatch = title.includes(searchTerm);

                // Show or hide the item based on whether it's a match
                if (isMatch) {
                    item.style.display = ''; // The default display style (e.g., 'block', 'flex')
                } else {
                    item.style.display = 'none'; // Hides the element from view
                }
            });
        });
    } else {
        console.error("Error: The 'search-input' or 'exam-list' element was not found. Please ensure the IDs are correct in your HTML.");
    }
});