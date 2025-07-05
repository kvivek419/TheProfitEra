document.addEventListener('DOMContentLoaded', function () {
    // Ensure Chart.js is loaded before proceeding with calculator logic
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please ensure it is linked correctly.');
        return;
    }

    // Calculator Section Elements
    const emiCalculatorSection = document.getElementById('emi-calculator-section');
    const sipCalculatorSection = document.getElementById('sip-calculator-section');
    const fdCalculatorSection = document.getElementById('fd-calculator-section');

    // EMI Calculator Elements
    const loanAmountSlider = document.getElementById('loanAmount');
    const interestRateSlider = document.getElementById('interestRate');
    const loanTenureSlider = document.getElementById('loanTenure');
    const loanAmountValue = document.getElementById('loanAmountValue');
    const interestRateValue = document.getElementById('interestRateValue');
    const loanTenureValue = document.getElementById('loanTenureValue');
    const emiResult = document.getElementById('emiResult');
    const principalResult = document.getElementById('principalResult');
    const interestResult = document.getElementById('interestResult');
    const totalResult = document.getElementById('totalResult');
    const emiCtx = document.getElementById('emiChart') ? document.getElementById('emiChart').getContext('2d') : null;
    let emiChart;

    // SIP Calculator Elements
    const monthlyInvestmentSlider = document.getElementById('monthlyInvestment');
    const sipReturnRateSlider = document.getElementById('sipReturnRate');
    const investmentPeriodSlider = document.getElementById('investmentPeriod');
    const monthlyInvestmentValue = document.getElementById('monthlyInvestmentValue');
    const sipReturnRateValue = document.getElementById('sipReturnRateValue');
    const investmentPeriodValue = document.getElementById('investmentPeriodValue');
    const sipResult = document.getElementById('sipResult');
    const investedAmountResult = document.getElementById('investedAmountResult');
    const wealthGainedResult = document.getElementById('wealthGainedResult');
    const sipCtx = document.getElementById('sipChart') ? document.getElementById('sipChart').getContext('2d') : null;
    let sipChart;

    // FD Calculator Elements
    const fdPrincipalSlider = document.getElementById('fdPrincipal');
    const fdInterestRateSlider = document.getElementById('fdInterestRate');
    const fdTenureSlider = document.getElementById('fdTenure');
    const compoundingFrequencySelect = document.getElementById('compoundingFrequency');
    const fdPrincipalValue = document.getElementById('fdPrincipalValue');
    const fdInterestRateValue = document.getElementById('fdInterestRateValue');
    const fdTenureValue = document.getElementById('fdTenureValue');
    const fdMaturityResult = document.getElementById('fdMaturityResult');
    const fdPrincipalInvested = document.getElementById('fdPrincipalInvested');
    const fdInterestEarned = document.getElementById('fdInterestEarned');
    const fdCtx = document.getElementById('fdChart') ? document.getElementById('fdChart').getContext('2d') : null;
    let fdChart;

    const htmlElement = document.documentElement; // For theme detection

    // Helper function to format currency for Indian Rupees
    function formatCurrency(num) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num).replace('₹', '₹ ');
    }

    // Helper function to format numbers with Indian locale commas
    function formatNumber(num) {
        return new Intl.NumberFormat('en-IN').format(num);
    }

    // --- EMI Calculator Functions ---
    function createEmiChart(principal, interest) {
        if (emiChart) {
            emiChart.destroy();
        }
        const textColor = htmlElement.classList.contains('dark') ? '#E2E8F0' : '#4B5563';
        const principalColor = htmlElement.classList.contains('dark') ? '#63B3ED' : '#2563EB'; // Blue
        const interestColor = htmlElement.classList.contains('dark') ? '#4A5568' : '#DBEAFE'; // Light Blue/Gray

        if (!emiCtx) return; // Exit if context is not available

        emiChart = new Chart(emiCtx, {
            type: 'doughnut',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, interest],
                    backgroundColor: [principalColor, interestColor],
                    borderColor: [htmlElement.classList.contains('dark') ? '#1A202C' : '#FFFFFF', htmlElement.classList.contains('dark') ? '#1A202C' : '#FFFFFF'],
                    borderWidth: 4,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            font: {
                                size: 14,
                                family: 'Inter',
                            },
                            boxWidth: 15,
                            padding: 20,
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatCurrency(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function calculateEMI() {
        if (!loanAmountSlider || !interestRateSlider || !loanTenureSlider) return;

        const p = parseFloat(loanAmountSlider.value);
        const r = parseFloat(interestRateSlider.value) / 12 / 100; // Monthly interest rate
        const n = parseFloat(loanTenureSlider.value) * 12; // Total months

        if (p > 0 && r > 0 && n > 0) {
            const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            const totalPayment = emi * n;
            const totalInterest = totalPayment - p;

            if (emiResult) emiResult.textContent = formatCurrency(emi);
            if (principalResult) principalResult.textContent = formatCurrency(p);
            if (interestResult) interestResult.textContent = formatCurrency(totalInterest);
            if (totalResult) totalResult.textContent = formatCurrency(totalPayment);

            createEmiChart(p, totalInterest);
        } else {
            // Handle invalid inputs (e.g., set to 0 or display error)
            if (emiResult) emiResult.textContent = formatCurrency(0);
            if (principalResult) principalResult.textContent = formatCurrency(0);
            if (interestResult) interestResult.textContent = formatCurrency(0);
            if (totalResult) totalResult.textContent = formatCurrency(0);
            createEmiChart(0, 0); // Clear chart or show empty state
        }
    }

    function updateEmiValues() {
        if (loanAmountValue) loanAmountValue.value = formatNumber(loanAmountSlider.value);
        if (interestRateValue) interestRateValue.value = interestRateSlider.value;
        if (loanTenureValue) loanTenureValue.value = loanTenureSlider.value;
        calculateEMI();
    }

    // Add event listeners for EMI calculator
    if (loanAmountSlider) loanAmountSlider.addEventListener('input', updateEmiValues);
    if (interestRateSlider) interestRateSlider.addEventListener('input', updateEmiValues);
    if (loanTenureSlider) loanTenureSlider.addEventListener('input', updateEmiValues);

    if (loanAmountValue) loanAmountValue.addEventListener('change', (e) => {
        let val = parseInt(e.target.value.replace(/,/g, ''), 10);
        if (!isNaN(val) && val >= loanAmountSlider.min && val <= loanAmountSlider.max) {
            loanAmountSlider.value = val;
            updateEmiValues();
        } else {
            loanAmountValue.value = formatNumber(loanAmountSlider.value);
        }
    });

    if (interestRateValue) interestRateValue.addEventListener('change', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= interestRateSlider.min && val <= interestRateSlider.max) {
            interestRateSlider.value = val;
            updateEmiValues();
        } else {
            interestRateValue.value = interestRateSlider.value;
        }
    });

    if (loanTenureValue) loanTenureValue.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= loanTenureSlider.min && val <= loanTenureSlider.max) {
            loanTenureSlider.value = val;
            updateEmiValues();
        } else {
            loanTenureValue.value = loanTenureSlider.value;
        }
    });

    // --- SIP Calculator Functions ---
    function createSipChart(invested, gained) {
        if (sipChart) {
            sipChart.destroy();
        }
        const textColor = htmlElement.classList.contains('dark') ? '#E2E8F0' : '#4B5563';
        const investedColor = htmlElement.classList.contains('dark') ? '#68D391' : '#16A34A'; // Green
        const gainedColor = htmlElement.classList.contains('dark') ? '#4A5568' : '#DBEAFE'; // Light Blue/Gray

        if (!sipCtx) return; // Exit if context is not available

        sipChart = new Chart(sipCtx, {
            type: 'doughnut',
            data: {
                labels: ['Amount Invested', 'Wealth Gained'],
                datasets: [{
                    data: [invested, gained],
                    backgroundColor: [investedColor, gainedColor],
                    borderColor: [htmlElement.classList.contains('dark') ? '#1A202C' : '#FFFFFF', htmlElement.classList.contains('dark') ? '#1A202C' : '#FFFFFF'],
                    borderWidth: 4,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            font: {
                                size: 14,
                                family: 'Inter',
                            },
                            boxWidth: 15,
                            padding: 20,
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatCurrency(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function calculateSIP() {
        if (!monthlyInvestmentSlider || !sipReturnRateSlider || !investmentPeriodSlider) return;

        const p = parseFloat(monthlyInvestmentSlider.value); // Monthly Investment
        const r = parseFloat(sipReturnRateSlider.value) / 100 / 12; // Monthly Rate
        const n = parseFloat(investmentPeriodSlider.value) * 12; // Total Months

        if (p > 0 && r > 0 && n > 0) {
            const futureValue = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
            const investedAmount = p * n;
            const wealthGained = futureValue - investedAmount;

            if (sipResult) sipResult.textContent = formatCurrency(futureValue);
            if (investedAmountResult) investedAmountResult.textContent = formatCurrency(investedAmount);
            if (wealthGainedResult) wealthGainedResult.textContent = formatCurrency(wealthGained);

            createSipChart(investedAmount, wealthGained);
        } else {
            if (sipResult) sipResult.textContent = formatCurrency(0);
            if (investedAmountResult) investedAmountResult.textContent = formatCurrency(0);
            if (wealthGainedResult) wealthGainedResult.textContent = formatCurrency(0);
            createSipChart(0, 0); // Clear chart or show empty state
        }
    }

    function updateSipValues() {
        if (monthlyInvestmentValue) monthlyInvestmentValue.value = formatNumber(monthlyInvestmentSlider.value);
        if (sipReturnRateValue) sipReturnRateValue.value = sipReturnRateSlider.value;
        if (investmentPeriodValue) investmentPeriodValue.value = investmentPeriodSlider.value;
        calculateSIP();
    }

    // Add event listeners for SIP calculator
    if (monthlyInvestmentSlider) monthlyInvestmentSlider.addEventListener('input', updateSipValues);
    if (sipReturnRateSlider) sipReturnRateSlider.addEventListener('input', updateSipValues);
    if (investmentPeriodSlider) investmentPeriodSlider.addEventListener('input', updateSipValues);

    if (monthlyInvestmentValue) monthlyInvestmentValue.addEventListener('change', (e) => {
        let val = parseInt(e.target.value.replace(/,/g, ''), 10);
        if (!isNaN(val) && val >= monthlyInvestmentSlider.min && val <= monthlyInvestmentSlider.max) {
            monthlyInvestmentSlider.value = val;
            updateSipValues();
        } else {
            monthlyInvestmentValue.value = formatNumber(monthlyInvestmentSlider.value);
        }
    });

    if (sipReturnRateValue) sipReturnRateValue.addEventListener('change', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= sipReturnRateSlider.min && val <= sipReturnRateSlider.max) {
            sipReturnRateSlider.value = val;
            updateSipValues();
        } else {
            sipReturnRateValue.value = sipReturnRateSlider.value;
        }
    });

    if (investmentPeriodValue) investmentPeriodValue.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= investmentPeriodSlider.min && val <= investmentPeriodSlider.max) {
            investmentPeriodSlider.value = val;
            updateSipValues();
        } else {
            investmentPeriodValue.value = investmentPeriodSlider.value;
        }
    });

    // --- FD Calculator Functions ---
    function createFdChart(principal, interestEarned) {
        if (fdChart) {
            fdChart.destroy();
        }
        const textColor = htmlElement.classList.contains('dark') ? '#E2E8F0' : '#4B5563';
        const principalColor = htmlElement.classList.contains('dark') ? '#7C3AED' : '#9333EA'; // Purple
        const interestColor = htmlElement.classList.contains('dark') ? '#4A5568' : '#DBEAFE'; // Light Blue/Gray

        if (!fdCtx) return; // Exit if context is not available

        fdChart = new Chart(fdCtx, {
            type: 'doughnut',
            data: {
                labels: ['Principal Invested', 'Interest Earned'],
                datasets: [{
                    data: [principal, interestEarned],
                    backgroundColor: [principalColor, interestColor],
                    borderColor: [htmlElement.classList.contains('dark') ? '#1A202C' : '#FFFFFF', htmlElement.classList.contains('dark') ? '#1A202C' : '#FFFFFF'],
                    borderWidth: 4,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            font: {
                                size: 14,
                                family: 'Inter',
                            },
                            boxWidth: 15,
                            padding: 20,
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatCurrency(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function calculateFD() {
        if (!fdPrincipalSlider || !fdInterestRateSlider || !fdTenureSlider || !compoundingFrequencySelect) return;

        const p = parseFloat(fdPrincipalSlider.value); // Principal
        const r = parseFloat(fdInterestRateSlider.value) / 100; // Annual interest rate
        const t = parseFloat(fdTenureSlider.value); // Tenure in years
        const n = parseFloat(compoundingFrequencySelect.value); // Compounding frequency per year

        if (p > 0 && r > 0 && t > 0 && n > 0) {
            const maturityAmount = p * Math.pow((1 + (r / n)), (n * t));
            const interestEarned = maturityAmount - p;

            if (fdMaturityResult) fdMaturityResult.textContent = formatCurrency(maturityAmount);
            if (fdPrincipalInvested) fdPrincipalInvested.textContent = formatCurrency(p);
            if (fdInterestEarned) fdInterestEarned.textContent = formatCurrency(interestEarned);

            createFdChart(p, interestEarned);
        } else {
            if (fdMaturityResult) fdMaturityResult.textContent = formatCurrency(0);
            if (fdPrincipalInvested) fdPrincipalInvested.textContent = formatCurrency(0);
            if (fdInterestEarned) fdInterestEarned.textContent = formatCurrency(0);
            createFdChart(0, 0); // Clear chart or show empty state
        }
    }

    function updateFdValues() {
        if (fdPrincipalValue) fdPrincipalValue.value = formatNumber(fdPrincipalSlider.value);
        if (fdInterestRateValue) fdInterestRateValue.value = fdInterestRateSlider.value;
        if (fdTenureValue) fdTenureValue.value = fdTenureSlider.value;
        calculateFD();
    }

    // Add event listeners for FD calculator
    if (fdPrincipalSlider) fdPrincipalSlider.addEventListener('input', updateFdValues);
    if (fdInterestRateSlider) fdInterestRateSlider.addEventListener('input', updateFdValues);
    if (fdTenureSlider) fdTenureSlider.addEventListener('input', updateFdValues);
    if (compoundingFrequencySelect) compoundingFrequencySelect.addEventListener('change', updateFdValues);

    if (fdPrincipalValue) fdPrincipalValue.addEventListener('change', (e) => {
        let val = parseInt(e.target.value.replace(/,/g, ''), 10);
        if (!isNaN(val) && val >= fdPrincipalSlider.min && val <= fdPrincipalSlider.max) {
            fdPrincipalSlider.value = val;
            updateFdValues();
        } else {
            fdPrincipalValue.value = formatNumber(fdPrincipalSlider.value);
        }
    });

    if (fdInterestRateValue) fdInterestRateValue.addEventListener('change', (e) => {
        let val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= fdInterestRateSlider.min && val <= fdInterestRateSlider.max) {
            fdInterestRateSlider.value = val;
            updateFdValues();
        } else {
            fdInterestRateValue.value = fdInterestRateSlider.value;
        }
    });

    if (fdTenureValue) fdTenureValue.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= fdTenureSlider.min && val <= fdTenureSlider.max) {
            fdTenureSlider.value = val;
            updateFdValues();
        } else {
            fdTenureValue.value = fdTenureSlider.value;
        }
    });


    // --- Calculator Display Logic ---
    window.showCalculator = function (type) {
        // Hide all calculator sections first
        const allCalculatorSections = document.querySelectorAll('.calculator-section');
        allCalculatorSections.forEach(section => {
            section.classList.add('hidden');
        });

        // Show the requested calculator section
        let targetSection;
        if (type === 'emi' && emiCalculatorSection) {
            targetSection = emiCalculatorSection;
            updateEmiValues(); // Calculate and draw chart for EMI
        } else if (type === 'sip' && sipCalculatorSection) {
            targetSection = sipCalculatorSection;
            updateSipValues(); // Calculate and draw chart for SIP
        } else if (type === 'fd' && fdCalculatorSection) {
            targetSection = fdCalculatorSection;
            updateFdValues(); // Calculate and draw chart for FD
        }

        if (targetSection) {
            targetSection.classList.remove('hidden');
            // Scroll to the calculator section
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.hideAllCalculators = function () {
        const allCalculatorSections = document.querySelectorAll('.calculator-section');
        allCalculatorSections.forEach(section => {
            section.classList.add('hidden');
        });
    };

    // Initial calculation and chart drawing for default visible calculator
    // This will run only if the calculator.html is loaded directly
    if (emiCalculatorSection && !emiCalculatorSection.classList.contains('hidden')) {
        updateEmiValues();
    } else if (sipCalculatorSection && !sipCalculatorSection.classList.contains('hidden')) {
        updateSipValues();
    } else if (fdCalculatorSection && !fdCalculatorSection.classList.contains('hidden')) {
        updateFdValues();
    }

    // Function to update charts when theme changes (called from script.js)
    window.updateChartsOnThemeChange = function() {
        if (emiCalculatorSection && !emiCalculatorSection.classList.contains('hidden')) {
            calculateEMI();
        }
        if (sipCalculatorSection && !sipCalculatorSection.classList.contains('hidden')) {
            calculateSIP();
        }
        if (fdCalculatorSection && !fdCalculatorSection.classList.contains('hidden')) {
            calculateFD();
        }
    };

    // Check URL hash for direct calculator links (e.g., calculators.html#sip-calculator)
    const hash = window.location.hash;
    if (hash) {
        const calculatorType = hash.replace('-calculator', '').substring(1); // e.g., "#emi-calculator" -> "emi"
        if (['emi', 'sip', 'fd'].includes(calculatorType)) {
            showCalculator(calculatorType);
        }
    }
});