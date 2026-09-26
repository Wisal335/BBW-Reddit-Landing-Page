document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const readingProgress = document.getElementById("readingProgress");
    const backToTop = document.getElementById("backToTop");

    const comparisonRows = Array.from(
        document.querySelectorAll(".comparison-table tbody tr")
    );
    const comparisonFilters = Array.from(
        document.querySelectorAll(".comparison-filter")
    );

    const processInspector = document.getElementById("processInspector");
    const inspectorTitle = document.getElementById("inspectorTitle");
    const inspectorDescription = document.getElementById("inspectorDescription");
    const inspectorCode = document.getElementById("inspectorCode");

    const architectureMap = document.querySelector(".architecture-map");
    const architectureNodes = Array.from(
        document.querySelectorAll(".architecture-node")
    );
    const architectureInspector = document.getElementById("architectureInspector");
    const architectureNodeNumber = document.getElementById("architectureNodeNumber");
    const architecturePurpose = document.getElementById("architecturePurpose");
    const architectureExample = document.getElementById("architectureExample");
    const architectureNext = document.getElementById("architectureNext");

    const mobileNavLinks = Array.from(
        document.querySelectorAll(".mobile-section-nav a")
    );

    /* ---------------------------------------------------------
       READING PROGRESS + BACK TO TOP
    --------------------------------------------------------- */

    let scrollTicking = false;

    const updateScrollUI = () => {
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = documentHeight > 0
            ? (window.scrollY / documentHeight) * 100
            : 0;

        if (readingProgress) {
            readingProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }

        if (backToTop) {
            backToTop.classList.toggle("visible", window.scrollY > 700);
        }

        scrollTicking = false;
    };

    const requestScrollUpdate = () => {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollUI);
    };

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    updateScrollUI();

    backToTop?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth"
        });
    });

    /* ---------------------------------------------------------
       SCROLL REVEAL
    --------------------------------------------------------- */

    const revealElements = document.querySelectorAll("[data-reveal]");

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    /* ---------------------------------------------------------
       PROCESS INSPECTOR
    --------------------------------------------------------- */

    const processData = {
        "lead-intake": {
            title: "Lead intake",
            description: "Incoming information arrives through channels that may not share one system state.",
            code: "EVENT → NORMALIZE"
        },

        "data-entry": {
            title: "Data entry",
            description: "The same information is read and entered again, creating a second state to maintain.",
            code: "INPUT → STRUCTURE"
        },

        qualification: {
            title: "Qualification",
            description: "A person checks criteria and decides which state the workflow should enter next.",
            code: "DATA → RULE"
        },

        "follow-up": {
            title: "Follow-up",
            description: "The next response depends on someone remembering the timing, context and action.",
            code: "RULE → ACTION"
        },

        "crm-update": {
            title: "CRM update",
            description: "A system record is updated from another source, creating a synchronization dependency.",
            code: "SOURCE → API"
        },

        quote: {
            title: "Quote generation",
            description: "Inputs are gathered, calculated and prepared before the resulting document is produced.",
            code: "VALIDATE → GENERATE"
        },

        notification: {
            title: "Notification",
            description: "The next person or system is informed so the workflow can continue.",
            code: "EVENT → MESSAGE"
        },

        reporting: {
            title: "Reporting",
            description: "Events are collected and assembled into a view that can explain what happened over time.",
            code: "LOG → REPORT"
        }
    };

    let selectedProcessRow = null;

    const getVisibleRows = () =>
        comparisonRows.filter((row) => !row.classList.contains("filtered-out"));

    const selectProcessRow = (row) => {
        if (!row || row.classList.contains("filtered-out")) return;

        comparisonRows.forEach((item) => {
            item.classList.toggle("selected", item === row);
            item.setAttribute("aria-selected", item === row ? "true" : "false");
        });

        selectedProcessRow = row;

        const key = row.dataset.process;
        const data = processData[key];

        if (!data) return;

        if (inspectorTitle) inspectorTitle.textContent = data.title;
        if (inspectorDescription) inspectorDescription.textContent = data.description;
        if (inspectorCode) inspectorCode.textContent = data.code;

        processInspector?.classList.add("inspector-active");
    };

    comparisonRows.forEach((row) => {
        row.setAttribute("role", "button");
        row.setAttribute("aria-selected", "false");

        row.addEventListener("click", () => selectProcessRow(row));

        row.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectProcessRow(row);
            }
        });
    });

    if (comparisonRows[0]) {
        selectProcessRow(comparisonRows[0]);
    }

    /* ---------------------------------------------------------
       COMPARISON FILTERS
    --------------------------------------------------------- */

    const applyComparisonFilter = (filter) => {
        comparisonFilters.forEach((button) => {
            const active = button === filter;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", active ? "true" : "false");
        });

        const category = filter.dataset.filter || "all";

        comparisonRows.forEach((row) => {
            const visible =
                category === "all" ||
                row.dataset.category === category;

            row.classList.toggle("filtered-out", !visible);
            row.setAttribute(
                "aria-hidden",
                visible ? "false" : "true"
            );
        });

        if (selectedProcessRow?.classList.contains("filtered-out")) {
            const firstVisible = getVisibleRows()[0];

            if (firstVisible) {
                selectProcessRow(firstVisible);
            }
        }
    };

    comparisonFilters.forEach((filter) => {
        filter.addEventListener("click", () =>
            applyComparisonFilter(filter)
        );
    });

    /* ---------------------------------------------------------
       ARCHITECTURE INSPECTOR
    --------------------------------------------------------- */

    const architectureData = {
        input: {
            number: "01 / INPUT",
            purpose: "Detect the event that begins the workflow.",
            example: "form.submit",
            next: "INPUT → VALIDATION"
        },

        validation: {
            number: "02 / VALIDATE",
            purpose: "Check that the incoming data is complete and usable.",
            example: "payload.is_valid",
            next: "VALIDATION → LOGIC"
        },

        logic: {
            number: "03 / LOGIC",
            purpose: "Apply explicit rules to determine the next state.",
            example: "rules.evaluate(payload)",
            next: "LOGIC → INTEGRATION"
        },

        api: {
            number: "04 / INTEGRATE",
            purpose: "Pass structured data to the system that owns the next state.",
            example: "crm.update(record)",
            next: "INTEGRATION → ACTION"
        },

        automation: {
            number: "05 / AUTOMATE",
            purpose: "Execute the defined action without requiring another manual handoff.",
            example: "task.create()",
            next: "ACTION → LOG"
        },

        logging: {
            number: "06 / LOG",
            purpose: "Record what happened so the workflow can be traced later.",
            example: "workflow.record()",
            next: "LOG → OUTPUT"
        },

        output: {
            number: "07 / OUTPUT",
            purpose: "Expose the resulting state, message, task or record.",
            example: "result.ready",
            next: "OUTPUT → COMPLETE"
        }
    };

    const selectArchitectureNode = (node) => {
        const key = node?.dataset.node;
        const data = architectureData[key];

        if (!data) return;

        architectureNodes.forEach((item) => {
            const active = item === node;

            item.classList.toggle("active", active);
            item.setAttribute(
                "aria-pressed",
                active ? "true" : "false"
            );
        });

        const index = Math.max(0, architectureNodes.indexOf(node));

        const progress = architectureNodes.length > 1
            ? (index / (architectureNodes.length - 1)) * 100
            : 0;

        architectureMap?.style.setProperty(
            "--active-progress",
            `${progress}%`
        );

        if (architectureNodeNumber) {
            architectureNodeNumber.textContent = data.number;
        }

        if (architecturePurpose) {
            architecturePurpose.textContent = data.purpose;
        }

        if (architectureExample) {
            architectureExample.textContent = data.example;
        }

        if (architectureNext) {
            architectureNext.textContent = data.next;
        }

        architectureInspector?.classList.add("inspector-active");
    };

    architectureNodes.forEach((node) => {
        node.addEventListener("click", () =>
            selectArchitectureNode(node)
        );
    });

    if (architectureNodes[0]) {
        selectArchitectureNode(architectureNodes[0]);
    }

    /* ---------------------------------------------------------
       SECTION-AWARE MOBILE NAV
    --------------------------------------------------------- */

    const sectionTargets = [
        { id: "top", nav: null },

        {
            id: "comparison",
            nav: mobileNavLinks.find(
                (link) =>
                    link.getAttribute("href") === "#comparison"
            )
        },

        {
            id: "architecture",
            nav: mobileNavLinks.find(
                (link) =>
                    link.getAttribute("href") === "#architecture"
            )
        },

        {
            id: "workflow-example",
            nav: mobileNavLinks.find(
                (link) =>
                    link.getAttribute("href") === "#workflow-example"
            )
        }
    ].filter(
        (item) =>
            item.nav &&
            document.getElementById(item.id)
    );

    const setActiveMobileNav = (activeId) => {
        mobileNavLinks.forEach((link) => {
            const active =
                link.getAttribute("href") === `#${activeId}`;

            link.setAttribute(
                "aria-current",
                active ? "true" : "false"
            );
        });
    };

    if (
        "IntersectionObserver" in window &&
        sectionTargets.length
    ) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio -
                            a.intersectionRatio
                    )[0];

                if (visible) {
                    setActiveMobileNav(
                        visible.target.id
                    );

                    document.body.dataset.activeSection =
                        visible.target.id;
                }
            },
            {
                threshold: [0.2, 0.45, 0.7],
                rootMargin: "-18% 0px -55% 0px"
            }
        );

        sectionTargets.forEach(({ id }) => {
            const section =
                document.getElementById(id);

            if (section) {
                sectionObserver.observe(section);
            }
        });
    }

    /* ---------------------------------------------------------
       ONE INTERNAL-LINK SCROLL HANDLER
    --------------------------------------------------------- */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {
            link.addEventListener("click", (event) => {
                const href =
                    link.getAttribute("href");

                if (!href || href === "#") return;

                const target =
                    document.querySelector(href);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior:
                        reduceMotion
                            ? "auto"
                            : "smooth",
                    block: "start"
                });

                history.replaceState(
                    null,
                    "",
                    href
                );
            });
        });

    /* ---------------------------------------------------------
       KEYBOARD SAFETY
       No Escape deselection: the inspector always matches the
       currently selected visible row.
    --------------------------------------------------------- */
});