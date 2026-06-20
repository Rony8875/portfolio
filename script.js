/* ==========================================================================
   Roshan Mali Portfolio JavaScript
   Handles dynamic animations, UI interactions, and Mock MIS Dashboard logic
   ========================================================================== */

// CONFIGURATION: If you want to connect your contact form to Google Sheets,
// paste your deployed Google Apps Script Web App URL below:
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycby32LL33O8NIuNqI9yM3AjinHGt0dRpk9BQcciTMpe_kn30FxAfdEw7d53eHPxmw9SC/exec";

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Navigation Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // 3. Navigation Active State on Scroll (Intersection Observer)
    const sections = document.querySelectorAll('section');
    const navObserverOptions = {
        threshold: 0.3,
        rootMargin: "-20% 0px -60% 0px"
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it is shown, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => revealObserver.observe(element));

    // 5. Typewriter Animation for Hero Section
    const typingElement = document.getElementById('typingText');
    const roles = ["EDP Officer", "Data Analyst", "MIS Specialist", "Excel Specialist"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        if (!typingElement) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Type normally
        }

        // Handle transitions between typing and deleting
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before starting next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typewriter
    type();

    // 6. Contact Form Submission (Google Sheets Integration / Simulated Fallback)
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtnText = document.getElementById('submitBtnText');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Ensure feedback field is visible when submitting again
            formFeedback.style.display = 'block';

            // Disable submit button and show spinner
            submitBtnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            contactForm.querySelectorAll('.form-input, .btn').forEach(el => el.disabled = true);

            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const subject = document.getElementById('formSubject').value;
            const message = document.getElementById('formMessage').value;

            if (GOOGLE_SHEET_WEBAPP_URL && GOOGLE_SHEET_WEBAPP_URL !== 'YOUR_APPS_SCRIPT_WEBAPP_URL_HERE' && GOOGLE_SHEET_WEBAPP_URL.trim() !== '') {
                // Send real POST request to Google Apps Script
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('subject', subject);
                formData.append('message', message);

                fetch(GOOGLE_SHEET_WEBAPP_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Use 'no-cors' to bypass browser CORS checks on redirect to Google servers
                })
                    .then(() => {
                        formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully. Roshan Mali will get back to you shortly.`;
                        formFeedback.className = 'form-feedback success';
                        contactForm.reset();
                    })
                    .catch(error => {
                        console.error('Error submitting form:', error);
                        formFeedback.textContent = 'Oops! There was an error sending your message. Please check your connection and try again.';
                        formFeedback.className = 'form-feedback error';
                    })
                    .finally(() => {
                        submitBtnText.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                        contactForm.querySelectorAll('.form-input, .btn').forEach(el => el.disabled = false);

                        // Hide feedback alert after 8 seconds
                        setTimeout(() => {
                            formFeedback.style.display = 'none';
                        }, 8000);
                    });
            } else {
                // Simulate form submission delay (Simulated/mock database logging)
                setTimeout(() => {
                    formFeedback.textContent = `Thank you, ${name}! Your mock message has been sent successfully. (Note: Google Sheet URL is not configured).`;
                    formFeedback.className = 'form-feedback success';

                    // Reset form inputs and status
                    contactForm.reset();
                    submitBtnText.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                    contactForm.querySelectorAll('.form-input, .btn').forEach(el => el.disabled = false);

                    // Hide feedback alert after 8 seconds
                    setTimeout(() => {
                        formFeedback.style.display = 'none';
                    }, 8000);
                }, 1800);
            }
        });
    }

    // 7. Interactive Maven Fuzzy Factory Dashboard System (Using Chart.js)
    const datasetSelect = document.getElementById('datasetSelect');
    const filter1Select = document.getElementById('filter1Select');
    const filter2Select = document.getElementById('filter2Select');
    const filter1Label = document.querySelector('label[for="filter1Select"]');
    const filter2Label = document.querySelector('label[for="filter2Select"]');

    // KPI Stat elements (Renamed IDs to match new HTML)
    const statRevenue = document.getElementById('statRevenue');
    const statConvRate = document.getElementById('statConvRate');
    const statProfit = document.getElementById('statProfit');
    const chartTitle = document.getElementById('chartTitle');

    // Chart Configuration Variables
    let myChart = null;

    // Helper functions for formatting
    function formatCurrency(value) {
        if (value >= 1000000) {
            return '$' + (value / 1000000).toFixed(2) + 'M';
        } else if (value >= 1000) {
            return '$' + (value / 1000).toFixed(1) + 'K';
        }
        return '$' + value.toFixed(2);
    }

    function formatNumber(value) {
        return value.toLocaleString();
    }

    function getFilteredData() {
        const data = window.MAVEN_DATA;
        if (!data) return null;

        const reportType = datasetSelect.value;
        const device = filter1Select.value;
        const year = filter2Select.value;

        // Filter monthly trends by year
        let trends = data.monthly_trends;
        if (year !== 'all') {
            trends = trends.filter(t => t.month.startsWith(year));
        }

        return {
            trends: trends,
            products: data.products,
            reportType: reportType,
            device: device,
            year: year
        };
    }

    function renderDashboard() {
        const dashboard = getFilteredData();
        if (!dashboard) return;

        const ctx = document.getElementById('analyticsChart');
        if (!ctx) return;

        // Custom chart default stylings
        Chart.defaults.color = '#8b949e';
        Chart.defaults.font.family = 'Inter, sans-serif';

        // Destroy previous chart instance if exists
        if (myChart) {
            myChart.destroy();
        }

        const labels = dashboard.trends.map(t => {
            // e.g. "2012-03" -> "Mar '12"
            const date = new Date(t.month + '-02'); // Use 2nd day to avoid timezone offsets
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[date.getMonth()] + " '" + String(date.getFullYear()).substring(2);
        });

        // 1. Calculate Aggregated KPIs for cards
        let totalRevenue = 0;
        let totalProfit = 0;
        let totalSessions = 0;
        let totalOrders = 0;
        let totalRefunds = 0;
        let totalRefundAmount = 0;

        dashboard.trends.forEach(t => {
            totalRevenue += t.revenue;
            totalProfit += t.profit;
            totalRefundAmount += t.refund_amount;
            totalOrders += t.orders;

            if (dashboard.device === 'desktop') {
                totalSessions += t.desktop_sessions;
            } else if (dashboard.device === 'mobile') {
                totalSessions += t.mobile_sessions;
            } else {
                totalSessions += t.sessions;
            }
        });

        const overallConvRate = totalSessions > 0 ? (totalOrders / totalSessions * 100) : 0;
        const overallRefundRate = totalOrders > 0 ? ((totalRefundAmount / totalRevenue) * 100) : 0; // standard proxy refund percentage

        // Set KPI titles & values dynamically depending on report selection
        const stat1Card = document.querySelector('.stat-card:nth-child(1)');
        const stat2Card = document.querySelector('.stat-card:nth-child(2)');
        const stat3Card = document.querySelector('.stat-card:nth-child(3)');

        const stat1Title = stat1Card.querySelector('.stat-title');
        const stat2Title = stat2Card.querySelector('.stat-title');
        const stat3Title = stat3Card.querySelector('.stat-title');

        // Reset sidebar filters availability depending on selection
        if (dashboard.reportType === 'products' || dashboard.reportType === 'refunds') {
            filter1Select.disabled = true;
            filter1Label.style.opacity = '0.5';
            filter1Select.style.opacity = '0.5';
        } else {
            filter1Select.disabled = false;
            filter1Label.style.opacity = '1';
            filter1Select.style.opacity = '1';
        }

        // Configure datasets & render Chart.js
        let chartDatasets = [];
        let chartType = 'line';
        let chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#161922',
                    titleColor: '#00f2fe',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255, 255, 255, 0.02)' } },
                y: { grid: { color: 'rgba(255, 255, 255, 0.02)' } }
            }
        };

        if (dashboard.reportType === 'revenue') {
            chartTitle.textContent = 'Monthly Revenue & Net Profit Growth';

            // Set KPI Cards
            stat1Title.textContent = 'Total Gross Revenue';
            statRevenue.textContent = formatCurrency(totalRevenue);

            stat2Title.textContent = 'Avg Conversion Rate';
            statConvRate.textContent = overallConvRate.toFixed(2) + '%';

            stat3Title.textContent = 'Net Profit Generated';
            statProfit.textContent = formatCurrency(totalProfit);

            // Double dataset (Revenue as Bars, Profit as Line)
            chartType = 'bar';
            chartDatasets = [
                {
                    label: 'Revenue',
                    data: dashboard.trends.map(t => t.revenue),
                    backgroundColor: 'rgba(79, 172, 254, 0.4)',
                    borderColor: '#4facfe',
                    borderWidth: 1.5,
                    order: 2,
                    borderRadius: 4
                },
                {
                    label: 'Net Profit',
                    data: dashboard.trends.map(t => t.profit),
                    type: 'line',
                    borderColor: '#00ff87',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    tension: 0.3,
                    order: 1
                }
            ];

            chartOptions.plugins.legend = { display: true, position: 'top' };
            chartOptions.scales.y.ticks = {
                callback: function (value) { return '$' + (value / 1000) + 'K'; }
            };

        } else if (dashboard.reportType === 'conversion') {
            chartTitle.textContent = 'Conversion Rate & Traffic Volume Trends';

            // Set KPI Cards
            stat1Title.textContent = 'Total Traffic (Sessions)';
            statRevenue.textContent = formatNumber(totalSessions);

            stat2Title.textContent = 'Overall Conv. Rate';
            statConvRate.textContent = overallConvRate.toFixed(2) + '%';

            stat3Title.textContent = 'E-Commerce Orders';
            statProfit.textContent = formatNumber(totalOrders);

            // Double line chart (Left axis for sessions, Right axis for conv_rate)
            chartType = 'line';
            chartDatasets = [
                {
                    label: 'Traffic Sessions',
                    data: dashboard.trends.map(t => {
                        if (dashboard.device === 'desktop') return t.desktop_sessions;
                        if (dashboard.device === 'mobile') return t.mobile_sessions;
                        return t.sessions;
                    }),
                    borderColor: '#00f2fe',
                    backgroundColor: 'rgba(0, 242, 254, 0.05)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Conversion Rate',
                    data: dashboard.trends.map(t => t.conv_rate),
                    borderColor: '#eab308',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ];

            chartOptions.plugins.legend = { display: true, position: 'top' };
            chartOptions.scales.y = {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { color: 'rgba(255, 255, 255, 0.02)' },
                ticks: { callback: function (value) { return value.toLocaleString(); } }
            };
            chartOptions.scales.y1 = {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false }, // Only show grid lines for left axis
                ticks: { callback: function (value) { return value + '%'; } }
            };

        } else if (dashboard.reportType === 'products') {
            chartTitle.textContent = 'Product Sales Performance Breakdown';

            // Find top product in filtered data
            let pSales = {};
            Object.keys(dashboard.products).forEach(pid => {
                pSales[pid] = 0;
                const name = dashboard.products[pid].name;
                // Sum sales for this year slice
                dashboard.trends.forEach(t => {
                    const mTrend = dashboard.products[pid].trends.find(pt => pt.month === t.month);
                    if (mTrend) {
                        pSales[pid] += mTrend.orders;
                    }
                });
            });

            let topProductId = '1';
            let maxOrders = 0;
            Object.keys(pSales).forEach(pid => {
                if (pSales[pid] > maxOrders) {
                    maxOrders = pSales[pid];
                    topProductId = pid;
                }
            });

            const topProdName = dashboard.products[topProductId] ? dashboard.products[topProductId].name : 'Mr. Fuzzy';
            const topProdShare = totalOrders > 0 ? (maxOrders / totalOrders * 100) : 0;

            // Set KPI Cards
            stat1Title.textContent = 'Top Selling Product';
            statRevenue.textContent = topProdName.replace('The ', '');

            stat2Title.textContent = 'Top Product Orders';
            statConvRate.textContent = formatNumber(maxOrders);

            stat3Title.textContent = 'Total Order Share';
            statProfit.textContent = topProdShare.toFixed(1) + '%';

            // Render 4 lines, one for each product
            chartType = 'line';
            const colors = ['#6366f1', '#ec4899', '#00ff87', '#38bdf8'];
            let idx = 0;

            Object.keys(dashboard.products).forEach(pid => {
                const prod = dashboard.products[pid];
                // map product trends to filtered years
                const prodData = dashboard.trends.map(t => {
                    const pt = prod.trends.find(pTrend => pTrend.month === t.month);
                    return pt ? pt.orders : 0;
                });

                chartDatasets.push({
                    label: prod.name.replace('The ', ''),
                    data: prodData,
                    borderColor: colors[idx % colors.length],
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.3
                });
                idx++;
            });

            chartOptions.plugins.legend = { display: true, position: 'top' };

        } else if (dashboard.reportType === 'refunds') {
            chartTitle.textContent = 'Product Refund Rates & Losses';

            // Set KPI Cards
            stat1Title.textContent = 'Total Refund Claims';
            statRevenue.textContent = formatNumber(Math.round(totalRefundAmount / 50)); // estimated claims

            stat2Title.textContent = 'Profit Refund Share';
            statConvRate.textContent = overallRefundRate.toFixed(2) + '%';

            stat3Title.textContent = 'Refund Amount Lost';
            statProfit.textContent = formatCurrency(totalRefundAmount);

            // Plot Refund Rate (Line) and Refund Amount (Bar)
            chartType = 'bar';
            chartDatasets = [
                {
                    label: 'Refund Value Lost ($)',
                    data: dashboard.trends.map(t => t.refund_amount),
                    backgroundColor: 'rgba(239, 68, 68, 0.3)',
                    borderColor: '#ef4444',
                    borderWidth: 1,
                    order: 2,
                    borderRadius: 4
                },
                {
                    label: 'Refund Rate (%)',
                    data: dashboard.trends.map(t => t.refund_rate),
                    type: 'line',
                    borderColor: '#ec4899',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.3,
                    order: 1
                }
            ];

            chartOptions.plugins.legend = { display: true, position: 'top' };
            chartOptions.scales.y.ticks = {
                callback: function (value) { return '$' + value; }
            };
        }

        // Render Chart.js
        myChart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: chartDatasets
            },
            options: chartOptions
        });
    }

    // Bind event listeners to dropdown selectors
    if (datasetSelect && filter1Select && filter2Select) {
        datasetSelect.addEventListener('change', renderDashboard);
        filter1Select.addEventListener('change', renderDashboard);
        filter2Select.addEventListener('change', renderDashboard);

        // Initialize Chart on load after window.MAVEN_DATA is loaded
        setTimeout(() => {
            if (window.MAVEN_DATA) {
                renderDashboard();
            } else {
                setTimeout(renderDashboard, 500);
            }
        }, 300);
    }

    // 8. JS vs Python Tab Toggling & Code Viewer
    const tabBtnJS = document.getElementById('tabBtnJS');
    const tabBtnPython = document.getElementById('tabBtnPython');
    const panelJSDashboard = document.getElementById('panelJSDashboard');
    const panelPythonReport = document.getElementById('panelPythonReport');

    const toggleCodeBtn = document.getElementById('toggleCodeBtn');
    const pythonCodeBlock = document.getElementById('pythonCodeBlock');

    if (tabBtnJS && tabBtnPython && panelJSDashboard && panelPythonReport) {
        tabBtnJS.addEventListener('click', () => {
            tabBtnJS.classList.add('active');
            tabBtnPython.classList.remove('active');
            panelJSDashboard.style.display = 'grid';
            panelPythonReport.style.display = 'none';
        });

        tabBtnPython.addEventListener('click', () => {
            tabBtnPython.classList.add('active');
            tabBtnJS.classList.remove('active');
            panelPythonReport.style.display = 'flex';
            panelJSDashboard.style.display = 'none';
        });
    }

    if (toggleCodeBtn && pythonCodeBlock) {
        toggleCodeBtn.addEventListener('click', () => {
            if (pythonCodeBlock.style.display === 'none') {
                pythonCodeBlock.style.display = 'block';
                toggleCodeBtn.innerHTML = '<i class="fa-solid fa-code"></i> Hide Source Code';
            } else {
                pythonCodeBlock.style.display = 'none';
                toggleCodeBtn.innerHTML = '<i class="fa-solid fa-code"></i> Show Source Code';
            }
        });
    }
});

