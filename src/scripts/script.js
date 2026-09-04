/* =========================================================
   BIG BRAIN WAY
   REDDIT — TECHNICAL SYSTEMS ANALYSIS
   INTERACTION SCRIPT
========================================================= */

(() => {
    "use strict";


    /* =====================================================
       DOM READY
    ===================================================== */

    const init = () => {


        /* =================================================
           ELEMENT REFERENCES
        ================================================= */

        const readingProgress =
            document.getElementById("readingProgress");

        const backToTop =
            document.getElementById("backToTop");

        const comparisonTable =
            document.querySelector(".comparison-table");

        const comparisonRows =
            document.querySelectorAll(
                ".comparison-table tbody tr"
            );

        const comparisonFilters =
            document.querySelectorAll(
                ".comparison-filter"
            );

        const processInspector =
            document.getElementById("processInspector");

        const inspectorTitle =
            document.getElementById("inspectorTitle");

        const inspectorDescription =
            document.getElementById(
                "inspectorDescription"
            );

        const inspectorCode =
            document.getElementById("inspectorCode");

        const architectureNodes =
            document.querySelectorAll(
                ".architecture-node"
            );

        const architectureNodeNumber =
            document.getElementById(
                "architectureNodeNumber"
            );

        const architecturePurpose =
            document.getElementById(
                "architecturePurpose"
            );

        const architectureExample =
            document.getElementById(
                "architectureExample"
            );

        const architectureNext =
            document.getElementById(
                "architectureNext"
            );

        const metricBars =
            document.querySelectorAll(
                ".metric-bar span[data-level]"
            );

        const mobileNavLinks =
            document.querySelectorAll(
                ".mobile-section-nav a"
            );

        const sections =
            document.querySelectorAll(
                "[data-section]"
            );


        /* =================================================
           REDUCED MOTION
        ================================================= */

        const prefersReducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        /* =================================================
           READING PROGRESS
        ================================================= */

        const updateReadingProgress = () => {

            if (!readingProgress) {
                return;
            }

            const documentHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;

            if (documentHeight <= 0) {
                readingProgress.style.width = "0%";
                return;
            }

            const scrollTop =
                window.scrollY ||
                document.documentElement.scrollTop;

            const progress =
                Math.min(
                    100,
                    Math.max(
                        0,
                        (scrollTop / documentHeight) * 100
                    )
                );

            readingProgress.style.width =
                `${progress}%`;
        };


        /* =================================================
           BACK TO TOP
        ================================================= */

        const updateBackToTop = () => {

            if (!backToTop) {
                return;
            }

            if (window.scrollY > 650) {

                backToTop.classList.add("visible");

            } else {

                backToTop.classList.remove("visible");

            }
        };


        if (backToTop) {

            backToTop.addEventListener(
                "click",
                () => {

                    window.scrollTo({
                        top: 0,
                        behavior:
                            prefersReducedMotion
                                ? "auto"
                                : "smooth"
                    });

                }
            );

        }


        /* =================================================
           SCROLL HANDLER
        ================================================= */

        let ticking = false;

        const handleScroll = () => {

            if (!ticking) {

                window.requestAnimationFrame(() => {

                    updateReadingProgress();
                    updateBackToTop();

                    ticking = false;

                });

                ticking = true;
            }

        };

        window.addEventListener(
            "scroll",
            handleScroll,
            { passive: true }
        );


        updateReadingProgress();
        updateBackToTop();


        /* =================================================
           SCROLL REVEAL
        ================================================= */

        const revealElements =
            document.querySelectorAll(
                "[data-reveal]"
            );


        if (
            "IntersectionObserver" in window &&
            !prefersReducedMotion
        ) {

            const revealObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "is-visible"
                                    );

                                    observer.unobserve(
                                        entry.target
                                    );
                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12,
                        rootMargin:
                            "0px 0px -60px 0px"
                    }
                );


            revealElements.forEach(
                (element) => {

                    revealObserver.observe(
                        element
                    );

                }
            );

        } else {

            revealElements.forEach(
                (element) => {

                    element.classList.add(
                        "is-visible"
                    );

                }
            );

        }


        /* =================================================
           PROCESS DATA
        ================================================= */

        const processData = {

            "lead-intake": {
                title: "Lead intake",
                description:
                    "Incoming information enters through multiple channels. The technical transition is from an external event to a normalized internal payload.",
                state:
                    "EXTERNAL EVENT → NORMALIZED INPUT"
            },

            "data-entry": {
                title: "Data entry",
                description:
                    "Information is manually copied from one location to another. The automation opportunity is to preserve the structured payload instead of recreating it.",
                state:
                    "RAW DATA → STRUCTURED PAYLOAD"
            },

            "qualification": {
                title: "Qualification",
                description:
                    "A person evaluates criteria and determines the next state. Automation encodes those decision rules so the same inputs produce a predictable branch.",
                state:
                    "INPUT → RULE EVALUATION"
            },

            "follow-up": {
                title: "Follow-up",
                description:
                    "A human notices an event, prepares a response and initiates the next action. An automated pipeline can react directly to the triggering event.",
                state:
                    "EVENT → CONDITION → RESPONSE"
            },

            "crm-update": {
                title: "CRM update",
                description:
                    "Customer or lead data is copied into a second system. An API-based pipeline can create or update the target record directly.",
                state:
                    "SOURCE DATA → API → CRM STATE"
            },

            "quote": {
                title: "Quote generation",
                description:
                    "Inputs are collected, calculations are performed and a document is prepared. A defined generation pipeline can standardize the sequence.",
                state:
                    "VALIDATED INPUT → GENERATION → DOCUMENT"
            },

            "notification": {
                title: "Notification",
                description:
                    "A completed state is communicated to another person or system. An event-driven workflow can emit the notification automatically.",
                state:
                    "STATE CHANGE → EVENT → NOTIFICATION"
            },

            "reporting": {
                title: "Reporting",
                description:
                    "Periodic reporting requires data collection and preparation. Structured event logging can create a continuous source for reporting.",
                state:
                    "EVENTS → LOG → DATA LAYER"
            }

        };


        /* =================================================
           UPDATE PROCESS INSPECTOR
        ================================================= */

        const updateProcessInspector = (
            processKey
        ) => {

            const data =
                processData[processKey];

            if (!data) {
                return;
            }

            if (inspectorTitle) {

                inspectorTitle.textContent =
                    data.title;

            }

            if (inspectorDescription) {

                inspectorDescription.textContent =
                    data.description;

            }

            if (inspectorCode) {

                inspectorCode.textContent =
                    data.state;

            }

            if (processInspector) {

                processInspector.classList.add(
                    "inspector-active"
                );

            }

        };


        /* =================================================
           SELECT PROCESS ROW
        ================================================= */

        const selectProcessRow = (
            row
        ) => {

            if (!row) {
                return;
            }

            comparisonRows.forEach(
                (item) => {

                    item.classList.remove(
                        "selected"
                    );

                }
            );


            row.classList.add(
                "selected"
            );


            const processKey =
                row.dataset.process;


            updateProcessInspector(
                processKey
            );

        };


        /* =================================================
           TABLE ROW INTERACTION
        ================================================= */

        comparisonRows.forEach(
            (row) => {

                row.addEventListener(
                    "click",
                    () => {

                        selectProcessRow(
                            row
                        );

                    }
                );


                row.addEventListener(
                    "keydown",
                    (event) => {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            selectProcessRow(
                                row
                            );

                        }

                    }
                );


                row.addEventListener(
                    "mouseenter",
                    () => {

                        row.classList.add(
                            "hovering"
                        );

                    }
                );


                row.addEventListener(
                    "mouseleave",
                    () => {

                        row.classList.remove(
                            "hovering"
                        );

                    }
                );

            }
        );


        /* =================================================
           DEFAULT PROCESS
        ================================================= */

        if (comparisonRows.length > 0) {

            selectProcessRow(
                comparisonRows[0]
            );

        }


        /* =================================================
           COMPARISON FILTERS
        ================================================= */

        comparisonFilters.forEach(
            (filterButton) => {

                filterButton.addEventListener(
                    "click",
                    () => {

                        const filter =
                            filterButton.dataset.filter;


                        comparisonFilters.forEach(
                            (button) => {

                                const active =
                                    button ===
                                    filterButton;

                                button.classList.toggle(
                                    "active",
                                    active
                                );

                                button.setAttribute(
                                    "aria-pressed",
                                    String(active)
                                );

                            }
                        );


                        comparisonRows.forEach(
                            (row) => {

                                const category =
                                    row.dataset.category;


                                const shouldShow =
                                    filter === "all" ||
                                    category === filter;


                                row.classList.toggle(
                                    "filtered-out",
                                    !shouldShow
                                );


                                if (shouldShow) {

                                    row.removeAttribute(
                                        "aria-hidden"
                                    );

                                } else {

                                    row.setAttribute(
                                        "aria-hidden",
                                        "true"
                                    );

                                }

                            }
                        );

                    }
                );

            }
        );


        /* =================================================
           ARCHITECTURE DATA
        ================================================= */

        const architectureData = {

            input: {
                number: "01 / INPUT",
                purpose:
                    "Detect the event that begins the workflow.",
                example:
                    "form.submit",
                next:
                    "INPUT → VALIDATION"
            },

            validation: {
                number: "02 / VALIDATE",
                purpose:
                    "Check whether incoming data satisfies the requirements needed by the next system state.",
                example:
                    "payload.is_valid",
                next:
                    "VALIDATION → LOGIC"
            },

            logic: {
                number: "03 / LOGIC",
                purpose:
                    "Evaluate defined business rules and determine which branch the workflow should follow.",
                example:
                    "rules.evaluate(payload)",
                next:
                    "LOGIC → INTEGRATION"
            },

            api: {
                number: "04 / INTEGRATE",
                purpose:
                    "Exchange structured information with another system through a defined interface.",
                example:
                    "api.request()",
                next:
                    "API → AUTOMATION"
            },

            automation: {
                number: "05 / AUTOMATE",
                purpose:
                    "Execute the required action after the preceding conditions have been satisfied.",
                example:
                    "workflow.execute()",
                next:
                    "ACTION → LOGGING"
            },

            logging: {
                number: "06 / LOG",
                purpose:
                    "Record the event, result, timestamp or error so the workflow can be reconstructed later.",
                example:
                    "workflow.record()",
                next:
                    "LOGGING → OUTPUT"
            },

            output: {
                number: "07 / OUTPUT",
                purpose:
                    "Produce the final state, notification, record or downstream result.",
                example:
                    "result.completed",
                next:
                    "OUTPUT → COMPLETE"
            }

        };


        /* =================================================
           UPDATE ARCHITECTURE INSPECTOR
        ================================================= */

        const updateArchitectureInspector = (
            nodeKey
        ) => {

            const data =
                architectureData[nodeKey];

            if (!data) {
                return;
            }


            if (architectureNodeNumber) {

                architectureNodeNumber.textContent =
                    data.number;

            }


            if (architecturePurpose) {

                architecturePurpose.textContent =
                    data.purpose;

            }


            if (architectureExample) {

                architectureExample.textContent =
                    data.example;

            }


            if (architectureNext) {

                architectureNext.textContent =
                    data.next;

            }

        };


        /* =================================================
           ARCHITECTURE NODE INTERACTION
        ================================================= */

        architectureNodes.forEach(
            (node) => {

                node.addEventListener(
                    "click",
                    () => {

                        architectureNodes.forEach(
                            (item) => {

                                const active =
                                    item === node;


                                item.classList.toggle(
                                    "active",
                                    active
                                );


                                item.setAttribute(
                                    "aria-expanded",
                                    String(active)
                                );

                            }
                        );


                        updateArchitectureInspector(
                            node.dataset.node
                        );

                    }
                );

            }
        );


        /* =================================================
           DEFAULT ARCHITECTURE NODE
        ================================================= */

        if (architectureNodes.length > 0) {

            const activeNode =
                document.querySelector(
                    ".architecture-node.active"
                );


            if (activeNode) {

                updateArchitectureInspector(
                    activeNode.dataset.node
                );

            } else {

                updateArchitectureInspector(
                    architectureNodes[0].dataset.node
                );

            }

        }


        /* =================================================
           METRIC BARS
        ================================================= */

        const animateMetricBars = () => {

            metricBars.forEach(
                (bar) => {

                    const level =
                        Number(
                            bar.dataset.level
                        );


                    if (
                        Number.isNaN(level)
                    ) {
                        return;
                    }


                    const safeLevel =
                        Math.min(
                            100,
                            Math.max(
                                0,
                                level
                            )
                        );


                    bar.style.setProperty(
                        "--metric-level",
                        `${safeLevel}%`
                    );


                    if (
                        !prefersReducedMotion
                    ) {

                        bar.classList.add(
                            "is-animated"
                        );

                    }

                }
            );

        };


        if (
            "IntersectionObserver" in window &&
            !prefersReducedMotion
        ) {

            const metricObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    animateMetricBars();

                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        threshold: 0.25
                    }
                );


            const metricGrid =
                document.querySelector(
                    ".metric-grid"
                );


            if (metricGrid) {

                metricObserver.observe(
                    metricGrid
                );

            }

        } else {

            animateMetricBars();

        }


        /* =================================================
           MOBILE SECTION NAVIGATION
        ================================================= */

        mobileNavLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            !href.startsWith("#")
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                href
                            );


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth",
                            block: "start"
                        });


                        history.replaceState(
                            null,
                            "",
                            href
                        );

                    }
                );

            }
        );


        /* =================================================
           ACTIVE SECTION DETECTION
        ================================================= */

        if (
            "IntersectionObserver" in window
        ) {

            const sectionObserver =
                new IntersectionObserver(
                    (entries) => {

                        entries.forEach(
                            (entry) => {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }


                                const sectionName =
                                    entry.target.dataset.section;


                                document.body.dataset.activeSection =
                                    sectionName || "";

                            }
                        );

                    },
                    {
                        threshold: 0.25,
                        rootMargin:
                            "-20% 0px -60% 0px"
                    }
                );


            sections.forEach(
                (section) => {

                    sectionObserver.observe(
                        section
                    );

                }
            );

        }


        /* =================================================
           KEYBOARD ACCESSIBILITY
        ================================================= */

        document.addEventListener(
            "keydown",
            (event) => {

                /*
                 * Escape removes selected
                 * table row state.
                 */

                if (
                    event.key === "Escape"
                ) {

                    comparisonRows.forEach(
                        (row) => {

                            row.classList.remove(
                                "selected"
                            );

                        }
                    );

                }

            }
        );


        /* =================================================
           SMOOTH INTERNAL LINKS
        ================================================= */

        const internalLinks =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        internalLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            href === "#"
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                href
                            );


                        if (!target) {
                            return;
                        }


                        /*
                         * Let the mobile navigation
                         * handler manage its own scroll.
                         */

                        if (
                            link.closest(
                                ".mobile-section-nav"
                            )
                        ) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth",
                            block: "start"
                        });


                        history.replaceState(
                            null,
                            "",
                            href
                        );

                    }
                );

            }
        );


        /* =================================================
           INITIALIZE
        ================================================= */

        document.documentElement.classList.add(
            "js-ready"
        );


        /*
         * Mark the first table row as selected.
         */

        if (comparisonRows.length > 0) {

            comparisonRows[0].classList.add(
                "selected"
            );

        }


        /*
         * Ensure metric levels exist even
         * when JavaScript animation is disabled.
         */

        metricBars.forEach(
            (bar) => {

                const level =
                    Number(
                        bar.dataset.level
                    );


                if (
                    !Number.isNaN(level)
                ) {

                    bar.style.setProperty(
                        "--metric-level",
                        `${Math.min(
                            100,
                            Math.max(
                                0,
                                level
                            )
                        )}%`
                    );

                }

            }
        );

    };


    /* =====================================================
       START
    ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();