document.addEventListener('DOMContentLoaded', function () {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded.');
        //alert('Unable to load charts. Please try again later.');
        return;
    }

    const emiCalculatorSection = document.getElementById('emi-calculator-section');
    const sipCalculatorSection = document.getElementById('sip-calculator-section');
    const fdCalculatorSection = document.getElementById('fd-calculator-section');

    if (!emiCalculatorSection || !sipCalculatorSection || !fdCalculatorSection) {
        console.error('One or more calculator sections not found.');
        return;
    }

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
    const emiCtx = document.getElementById('emiChart')?.getContext('2d');
    let emiChart;

    const monthlyInvestmentSlider = document.getElementById('monthlyInvestment');
    const sipReturnRateSlider = document.getElementById('sipReturnRate');
    const investmentPeriodSlider = document.getElementById('investmentPeriod');
    const monthlyInvestmentValue = document.getElementById('monthlyInvestmentValue');
    const sipReturnRateValue = document.getElementById('sipReturnRateValue');
    const investmentPeriodValue = document.getElementById('investmentPeriodValue');
    const sipResult = document.getElementById('sipResult');
    const investedAmountResult = document.getElementById('investedAmountResult');
    const wealthGainedResult = document.getElementById('wealthGainedResult');
    const sipCtx = document.getElementById('sipChart')?.getContext('2d');
    let sipChart;

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
    const fdCtx = document.getElementById('fdChart')?.getContext('2d');
    let fdChart;

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', mobileMenu.classList.contains('hidden') ? 'false' : 'true');
        });
    }

    const currentYearSpan = document.getElementById('current-year-footer-calc');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const htmlElement = document.documentElement;

    function formatCurrency(num) {
        if (isNaN(num) || num <= 0) return '₹ 0';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num).replace('₹', '₹ ');
    }

    function formatNumber(num) {
        if (isNaN(num) || num <= 0) return '0';
        return new Intl.NumberFormat('en-IN').format(num);
    }

    function createEmiChart(principal, interest) {
        if (emiChart) emiChart.destroy();
        if (!emiCtx) {
            console.error('EMI Chart context not found.');
            return;
        }
        const textColor = htmlElement.classList.contains('dark') ? '#F3F4F6' : '#4B5563';
        const principalColor = htmlElement.classList.contains('dark') ? '#93C5FD' : '#2563EB';
        const interestColor = htmlElement.classList.contains('dark') ? '#4B5568' : '#DBEAFE';

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
                            font: { size: 14, family: 'Inter', weight: '500' },
                            boxWidth: 15,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                if (context.parsed !== null) label += formatCurrency(context.parsed);
                                return label;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    function calculateEMI() {
        if (!loanAmountSlider || !interestRateSlider || !loanTenureSlider) {
            console.error('EMI Calculator elements missing.');
            return;
        }
        const p = parseFloat(loanAmountSlider.value);
        const r = parseFloat(interestRateSlider.value) / 12 / 100;
        const n = parseFloat(loanTenureSlider.value) * 12;
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
            if (emiResult) emiResult.textContent = formatCurrency(0);
            if (principalResult) principalResult.textContent = formatCurrency(0);
            if (interestResult) interestResult.textContent = formatCurrency(0);
            if (totalResult) totalResult.textContent = formatCurrency(0);
            createEmiChart(0, 0);
        }
    }

    function updateEmiValues() {
        if (loanAmountValue) loanAmountValue.value = formatNumber(loanAmountSlider.value);
        if (interestRateValue) interestRateValue.value = parseFloat(interestRateSlider.value).toFixed(1);
        if (loanTenureValue) loanTenureValue.value = loanTenureSlider.value;
        calculateEMI();
    }

    if (loanAmountSlider) {
        loanAmountSlider.addEventListener('input', updateEmiValues);
        loanAmountSlider.addEventListener('change', updateEmiValues);
    }
    if (interestRateSlider) {
        interestRateSlider.addEventListener('input', updateEmiValues);
        interestRateSlider.addEventListener('change', updateEmiValues);
    }
    if (loanTenureSlider) {
        loanTenureSlider.addEventListener('input', updateEmiValues);
        loanTenureSlider.addEventListener('change', updateEmiValues);
    }
    if (loanAmountValue) {
        loanAmountValue.addEventListener('input', (e) => {
            let val = parseInt(e.target.value.replace(/,/g, ''), 10);
            if (!isNaN(val) && val >= parseInt(loanAmountSlider.min) && val <= parseInt(loanAmountSlider.max)) {
                loanAmountSlider.value = val;
                updateEmiValues();
            } else {
                loanAmountValue.value = formatNumber(loanAmountSlider.value);
            }
        });
    }
    if (interestRateValue) {
        interestRateValue.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value);
            if (!isNaN(val) && val >= parseFloat(interestRateSlider.min) && val <= parseFloat(interestRateSlider.max)) {
                interestRateSlider.value = val;
                updateEmiValues();
            } else {
                interestRateValue.value = parseFloat(interestRateSlider.value).toFixed(1);
            }
        });
    }
    if (loanTenureValue) {
        loanTenureValue.addEventListener('input', (e) => {
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= parseInt(loanTenureSlider.min) && val <= parseInt(loanTenureSlider.max)) {
                loanTenureSlider.value = val;
                updateEmiValues();
            } else {
                loanTenureValue.value = loanTenureSlider.value;
            }
        });
    }

    function createSipChart(invested, gained) {
        if (sipChart) sipChart.destroy();
        if (!sipCtx) {
            console.error('SIP Chart context not found.');
            return;
        }
        const textColor = htmlElement.classList.contains('dark') ? '#F3F4F6' : '#4B5563';
        const investedColor = htmlElement.classList.contains('dark') ? '#86EFAC' : '#16A34A';
        const gainedColor = htmlElement.classList.contains('dark') ? '#4B5568' : '#DBEAFE';

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
                            font: { size: 14, family: 'Inter', weight: '500' },
                            boxWidth: 15,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                if (context.parsed !== null) label += formatCurrency(context.parsed);
                                return label;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    function calculateSIP() {
        if (!monthlyInvestmentSlider || !sipReturnRateSlider || !investmentPeriodSlider) {
            console.error('SIP Calculator elements missing.');
            return;
        }
        const p = parseFloat(monthlyInvestmentSlider.value);
        const r = parseFloat(sipReturnRateSlider.value) / 100 / 12;
        const n = parseFloat(investmentPeriodSlider.value) * 12;
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
            createSipChart(0, 0);
        }
    }

    function updateSipValues() {
        if (monthlyInvestmentValue) monthlyInvestmentValue.value = formatNumber(monthlyInvestmentSlider.value);
        if (sipReturnRateValue) sipReturnRateValue.value = parseFloat(sipReturnRateSlider.value).toFixed(1);
        if (investmentPeriodValue) investmentPeriodValue.value = investmentPeriodSlider.value;
        calculateSIP();
    }

    if (monthlyInvestmentSlider) {
        monthlyInvestmentSlider.addEventListener('input', updateSipValues);
        monthlyInvestmentSlider.addEventListener('change', updateSipValues);
    }
    if (sipReturnRateSlider) {
        sipReturnRateSlider.addEventListener('input', updateSipValues);
        sipReturnRateSlider.addEventListener('change', updateSipValues);
    }
    if (investmentPeriodSlider) {
        investmentPeriodSlider.addEventListener('input', updateSipValues);
        investmentPeriodSlider.addEventListener('change', updateSipValues);
    }
    if (monthlyInvestmentValue) {
        monthlyInvestmentValue.addEventListener('input', (e) => {
            let val = parseInt(e.target.value.replace(/,/g, ''), 10);
            if (!isNaN(val) && val >= parseInt(monthlyInvestmentSlider.min) && val <= parseInt(monthlyInvestmentSlider.max)) {
                monthlyInvestmentSlider.value = val;
                updateSipValues();
            } else {
                monthlyInvestmentValue.value = formatNumber(monthlyInvestmentSlider.value);
            }
        });
    }
    if (sipReturnRateValue) {
        sipReturnRateValue.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value);
            if (!isNaN(val) && val >= parseFloat(sipReturnRateSlider.min) && val <= parseFloat(sipReturnRateSlider.max)) {
                sipReturnRateSlider.value = val;
                updateSipValues();
            } else {
                sipReturnRateValue.value = parseFloat(sipReturnRateSlider.value).toFixed(1);
            }
        });
    }
    if (investmentPeriodValue) {
        investmentPeriodValue.addEventListener('input', (e) => {
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= parseInt(investmentPeriodSlider.min) && val <= parseInt(investmentPeriodSlider.max)) {
                investmentPeriodSlider.value = val;
                updateSipValues();
            } else {
                investmentPeriodValue.value = investmentPeriodSlider.value;
            }
        });
    }

    function createFdChart(principal, interestEarned) {
        if (fdChart) fdChart.destroy();
        if (!fdCtx) {
            console.error('FD Chart context not found.');
            return;
        }
        const textColor = htmlElement.classList.contains('dark') ? '#F3F4F6' : '#4B5563';
        const principalColor = htmlElement.classList.contains('dark') ? '#A78BFA' : '#9333EA';
        const interestColor = htmlElement.classList.contains('dark') ? '#4B5568' : '#DBEAFE';

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
                            font: { size: 14, family: 'Inter', weight: '500' },
                            boxWidth: 15,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                if (context.parsed !== null) label += formatCurrency(context.parsed);
                                return label;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    function calculateFD() {
        if (!fdPrincipalSlider || !fdInterestRateSlider || !fdTenureSlider || !compoundingFrequencySelect) {
            console.error('FD Calculator elements missing.');
            return;
        }
        const p = parseFloat(fdPrincipalSlider.value);
        const r = parseFloat(fdInterestRateSlider.value) / 100;
        const t = parseFloat(fdTenureSlider.value);
        const n = parseFloat(compoundingFrequencySelect.value);
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
            createFdChart(0, 0);
        }
    }

    function updateFdValues() {
        if (fdPrincipalValue) fdPrincipalValue.value = formatNumber(fdPrincipalSlider.value);
        if (fdInterestRateValue) fdInterestRateValue.value = parseFloat(fdInterestRateSlider.value).toFixed(1);
        if (fdTenureValue) fdTenureValue.value = fdTenureSlider.value;
        calculateFD();
    }

    if (fdPrincipalSlider) {
        fdPrincipalSlider.addEventListener('input', updateFdValues);
        fdPrincipalSlider.addEventListener('change', updateFdValues);
    }
    if (fdInterestRateSlider) {
        fdInterestRateSlider.addEventListener('input', updateFdValues);
        fdInterestRateSlider.addEventListener('change', updateFdValues);
    }
    if (fdTenureSlider) {
        fdTenureSlider.addEventListener('input', updateFdValues);
        fdTenureSlider.addEventListener('change', updateFdValues);
    }
    if (compoundingFrequencySelect) {
        compoundingFrequencySelect.addEventListener('change', updateFdValues);
    }
    if (fdPrincipalValue) {
        fdPrincipalValue.addEventListener('input', (e) => {
            let val = parseInt(e.target.value.replace(/,/g, ''), 10);
            if (!isNaN(val) && val >= parseInt(fdPrincipalSlider.min) && val <= parseInt(fdPrincipalSlider.max)) {
                fdPrincipalSlider.value = val;
                updateFdValues();
            } else {
                fdPrincipalValue.value = formatNumber(fdPrincipalSlider.value);
            }
        });
    }
    if (fdInterestRateValue) {
        fdInterestRateValue.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value);
            if (!isNaN(val) && val >= parseFloat(fdInterestRateSlider.min) && val <= parseFloat(fdInterestRateSlider.max)) {
                fdInterestRateSlider.value = val;
                updateFdValues();
            } else {
                fdInterestRateValue.value = parseFloat(fdInterestRateSlider.value).toFixed(1);
            }
        });
    }
    if (fdTenureValue) {
        fdTenureValue.addEventListener('input', (e) => {
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= parseInt(fdTenureSlider.min) && val <= parseInt(fdTenureSlider.max)) {
                fdTenureSlider.value = val;
                updateFdValues();
            } else {
                fdTenureValue.value = fdTenureSlider.value;
            }
        });
    }

    window.showCalculator = function (type) {
        console.log('showCalculator called with type:', type);
        [emiCalculatorSection, sipCalculatorSection, fdCalculatorSection].forEach(section => {
            if (section) {
                section.classList.add('hidden');
                section.classList.remove('animate-fade-in-up'); // Reset animation
            }
        });
        let targetSection;
        if (type === 'emi' && emiCalculatorSection) {
            targetSection = emiCalculatorSection;
            updateEmiValues();
        } else if (type === 'sip' && sipCalculatorSection) {
            targetSection = sipCalculatorSection;
            updateSipValues();
        } else if (type === 'fd' && fdCalculatorSection) {
            targetSection = fdCalculatorSection;
            updateFdValues();
        } else {
            console.error('Invalid calculator type or section not found:', type);
            return;
        }
        targetSection.classList.remove('hidden');
        targetSection.classList.add('animate-fade-in-up'); // Trigger animation
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    window.hideAllCalculators = function () {
        console.log('hideAllCalculators called');
        [emiCalculatorSection, sipCalculatorSection, fdCalculatorSection].forEach(section => {
            if (section) section.classList.add('hidden');
        });
    };

    const calculatorButtons = document.querySelectorAll('.calculator-card-button');
    calculatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('onclick').match(/'([^']+)'/)?.[1];
            if (type) {
                console.log('Button clicked for type:', type);
                window.showCalculator(type);
            } else {
                console.error('Calculator type not found in button onclick attribute.');
            }
        });
    });

    if (emiCalculatorSection && !emiCalculatorSection.classList.contains('hidden')) {
        updateEmiValues();
    } else if (sipCalculatorSection && !sipCalculatorSection.classList.contains('hidden')) {
        updateSipValues();
    } else if (fdCalculatorSection && !fdCalculatorSection.classList.contains('hidden')) {
        updateFdValues();
    }

    const hash = window.location.hash;
    if (hash) {
        const calculatorType = hash.replace('-calculator', '').substring(1);
        if (['emi', 'sip', 'fd'].includes(calculatorType)) {
            console.log('Navigating to calculator via hash:', calculatorType);
            window.showCalculator(calculatorType);
        }
    }

    window.updateChartsOnThemeChange = function() {
        if (emiCalculatorSection && !emiCalculatorSection.classList.contains('hidden')) {
            calculateEMI();
        } else if (sipCalculatorSection && !sipCalculatorSection.classList.contains('hidden')) {
            calculateSIP();
        } else if (fdCalculatorSection && !fdCalculatorSection.classList.contains('hidden')) {
            calculateFD();
        }
    };
});