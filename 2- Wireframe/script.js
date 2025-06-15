document.addEventListener('DOMContentLoaded', () => {
    const showPrejudgmentCheckbox = document.getElementById('showPrejudgmentCheckbox');
    const showPostjudgmentCheckbox = document.getElementById('showPostjudgmentCheckbox');
    const showPerDiemCheckbox = document.getElementById('showPerDiemCheckbox');
    const prejudgmentSection = document.querySelector('[data-display="prejudgmentSection"]');
    const postjudgmentSection = document.querySelector('[data-display="postjudgmentSection"]');
    const summaryPerDiemRow = document.querySelector('.per-diem-row');
    const clearButton = document.getElementById('clear-button');
    const printButton = document.getElementById('print-button');

    // Function to update visibility of sections based on checkboxes
    const updateSectionVisibility = () => {
        if (showPrejudgmentCheckbox.checked) {
            prejudgmentSection.style.display = '';
        } else {
            prejudgmentSection.style.display = 'none';
        }

        if (showPostjudgmentCheckbox.checked) {
            postjudgmentSection.style.display = '';
        } else {
            postjudgmentSection.style.display = 'none';
        }

        if (showPerDiemCheckbox.checked) {
            summaryPerDiemRow.style.display = '';
        } else {
            summaryPerDiemRow.style.display = 'none';
        }
    };

    // Initial update on page load
    updateSectionVisibility();

    // Add event listeners for checkboxes
    showPrejudgmentCheckbox.addEventListener('change', updateSectionVisibility);
    showPostjudgmentCheckbox.addEventListener('change', updateSectionVisibility);
    showPerDiemCheckbox.addEventListener('change', updateSectionVisibility);

    // Clear button functionality
    clearButton.addEventListener('click', () => {
        // Reset text inputs
        document.querySelector('[data-input="fileNo"]').value = '';
        document.querySelector('[data-input="registry"]').value = 'Vancouver';
        document.querySelector('[data-input="judgmentDate"]').value = '2024-12-11';
        document.querySelector('input[data-input="amountValue"]').value = '$10,000.00'; // General Damages
        document.querySelector('input[data-input="amountValue"][value="$0.00"]').value = '$0.00'; // Non-pecuniary and Costs
        document.querySelector('input[data-input="dateValue"][value="2019-04-14"]').value = '2019-04-14'; // Prejudgment from date
        document.querySelector('input[data-input="dateValue"][value="2025-06-14"]').value = '2025-06-14'; // Postjudgment until date

        // Reset checkboxes to checked
        showPrejudgmentCheckbox.checked = true;
        showPostjudgmentCheckbox.checked = true;
        showPerDiemCheckbox.checked = true;

        // Clear dynamically added special damages rows
        const specialDamagesRows = document.querySelectorAll('.special-damages-row');
        specialDamagesRows.forEach(row => row.remove());

        // Update visibility after clearing
        updateSectionVisibility();

        // Re-add the initial special damages row if it was removed
        // For now, we'll just leave it as is, as the original HTML has hardcoded special damages.
        // A more robust solution would involve a function to re-render initial state.
    });

    // Print button functionality
    printButton.addEventListener('click', () => {
        window.print();
    });

    // Add event listener for "add special damages" buttons
    document.querySelectorAll('.add-special-damages-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            const newRow = document.createElement('tr');
            newRow.classList.add('special-damages-row', 'breakable');
            newRow.innerHTML = `
                <td class="text-left"><input type="text" class="special-damages-date custom-date-input" data-type="special-damages-date" placeholder="YYYY-MM-DD" maxlength="10"></td>
                <td class="text-left"><input type="text" class="special-damages-description" placeholder="Describe special damages" data-type="special-damages-description"></td>
                <td class="text-center"></td>
                <td class="text-right"><input type="text" class="special-damages-amount" data-type="special-damages-amount"></td>
                <td class="text-right">
                    <div style="display:flex;justify-content:flex-end;align-items:center"><span class="delete-icon" title="Delete special damages">✕</span></div>
                </td>
            `;
            row.parentNode.insertBefore(newRow, row.nextSibling);

            // Add event listener for the new delete icon
            newRow.querySelector('.delete-icon').addEventListener('click', (e) => {
                e.target.closest('.special-damages-row').remove();
            });
        });
    });

    // Add event listeners for existing delete icons (for hardcoded special damages)
    document.querySelectorAll('.special-damages-row .delete-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.target.closest('.special-damages-row').remove();
        });
    });
});
