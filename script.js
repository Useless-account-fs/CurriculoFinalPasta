
"use strict";

// =============================================
// 1. DADOS ORIGINAIS DO CURRÍCULO
// =============================================

const initialCV = {
    metadata: {
        version: "1.0",
        language: "pt-BR",
        lastUpdated: "2026-11-05"
    },

    personalInformation: {
        fullName: "Enzo Faustino Ribeiro",
        professionalTitle: "",
        profilePhoto: "",
        email: "zumbigg2@gmail.com",
        phone: "",
        whatsapp: "11950930704",

        location: {
            city: "Suzano",
            state: "São Paulo",
            country: "Brasil",
            address: "Est. Santa Monica 600"
        },

        linkedin: "",
        github: "Useless-account-fs",
        portfolio: "",
        website: ""
    },

    professionalSummary: {
        description: "Tenho 18 anos e busco oportunidade no mercado de trabalho digital",
        yearsOfExperience: 0,
        mainSpecialization: "Inglês",
        careerObjective: "Crescer no mercado de trabalho e ter um emprego na área de cibersegurança"
    },

    professionalExperience: [
        {
            company: "",
            position: "",
            employmentType: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            responsibilities: [],
            achievements: [],
            technologies: []
        }
    ],

    education: [
        {
            institution: "UniPIAGET",
            degree: "2° semestre",
            fieldOfStudy: "Análise e desenvolvimento de sistemas (ADS)",
            level: "Iniciante",
            startDate: "Fevereiro de 2026",
            endDate: "Julho de 2028",
            current: false,
            description: ""
        }
    ],

    skills: {
        technical: [
            { name: "ADS", level: "Iniciante" }
        ],
        behavioral: [],
        tools: [],
        methodologies: []
    },

    languages: [
        {
            name: "Inglês",
            proficiency: "C1"
        }
    ],

    certifications: [
        {
            name: "Conclusão do Curso de Inglês",
            issuer: "OneWay Línguas",
            issueDate: "",
            expirationDate: "",
            credentialUrl: ""
        }
    ],

    projects: [
        {
            name: "",
            description: "",
            role: "",
            technologies: [],
            url: "",
            startDate: "",
            endDate: ""
        }
    ],

    courses: [
        {
            name: "Curso de Inglês",
            institution: "OneWay Línguas",
            completionDate: "2024",
            workloadHours: null
        }
    ],

    additionalInformation: {
        availability: "",
        workModel: "",
        travelAvailability: false,
        additionalNotes: ""
    },

    preferences: {
        targetPositions: [],
        targetIndustries: ["Tecnologia"],
        preferredLocations: [],
        preferredWorkModel: "Remoto"
    }
};


// =============================================
// 2. CONFIGURAÇÕES
// =============================================

const STORAGE_KEY = "cv_manager_data";

const sectionConfig = {
    personalInformation: {
        title: "Dados pessoais",
        description: "Informações de identificação e contato.",
        type: "object"
    },

    professionalSummary: {
        title: "Resumo profissional",
        description: "Sua apresentação e seus objetivos profissionais.",
        type: "object"
    },

    professionalExperience: {
        title: "Experiências profissionais",
        description: "Gerencie seus empregos e experiências.",
        type: "array"
    },

    education: {
        title: "Formação acadêmica",
        description: "Gerencie sua formação e estudos.",
        type: "array"
    },

    skills: {
        title: "Habilidades",
        description: "Gerencie suas competências profissionais.",
        type: "skills"
    },

    languages: {
        title: "Idiomas",
        description: "Idiomas e níveis de proficiência.",
        type: "array"
    },

    certifications: {
        title: "Certificações",
        description: "Certificados e qualificações.",
        type: "array"
    },

    projects: {
        title: "Projetos",
        description: "Seus projetos pessoais e profissionais.",
        type: "array"
    },

    courses: {
        title: "Cursos",
        description: "Cursos complementares e carga horária.",
        type: "array"
    },

    additionalInformation: {
        title: "Informações adicionais",
        description: "Disponibilidade e outras informações.",
        type: "object"
    },

    preferences: {
        title: "Preferências profissionais",
        description: "Cargos, setores e modelos de trabalho desejados.",
        type: "object"
    }
};

const skillConfig = {
    technical: "Habilidades técnicas",
    behavioral: "Habilidades comportamentais",
    tools: "Ferramentas",
    methodologies: "Metodologias"
};

let cv = loadData();
let currentSection = "overview";
let editingIndex = null;
let editingSkillCategory = null;


// =============================================
// 3. UTILITÁRIOS
// =============================================

function clone(data) {
    return JSON.parse(JSON.stringify(data));
}

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        return saved ? JSON.parse(saved) : clone(initialCV);
    } catch (error) {
        console.error("Erro ao carregar currículo:", error);
        return clone(initialCV);
    }
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cv));
        return true;
    } catch (error) {
        notify("Não foi possível salvar os dados: " + error.message, true);
        return false;
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function displayValue(value) {
    if (value === null || value === undefined || value === "") {
        return "Não informado";
    }

    if (typeof value === "boolean") {
        return value ? "Sim" : "Não";
    }

    if (Array.isArray(value)) {
        if (!value.length) return "Não informado";

        return value.map(item => {
            if (typeof item === "object" && item !== null) {
                return Object.values(item).filter(Boolean).join(" — ");
            }
            return item;
        }).join(", ");
    }

    if (typeof value === "object") {
        return Object.values(value).filter(Boolean).join(" • ") || "Não informado";
    }

    return String(value);
}

function notify(message, error = false) {
    const element = document.getElementById("notification");

    element.textContent = message;
    element.classList.toggle("error", error);
    element.hidden = false;

    clearTimeout(notify.timer);

    notify.timer = setTimeout(() => {
        element.hidden = true;
    }, 3500);
}

function formatDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function updateMetadata() {
    cv.metadata ??= {};
    cv.metadata.lastUpdated = formatDate();
}


// =============================================
// 4. NAVEGAÇÃO
// =============================================

function navigate(section) {
    currentSection = section;
    editingIndex = null;
    editingSkillCategory = null;

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.section === section
        );
    });

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const pageTitle = document.getElementById("pageTitle");

    if (section === "overview") {
        pageTitle.textContent = "Visão geral";

        document.getElementById("overview").classList.add("active");

        renderOverview();
        return;
    }

    if (section === "json") {
        pageTitle.textContent = "Editor JSON";

        document.getElementById("json").classList.add("active");

        loadJSONEditor();
        return;
    }

    pageTitle.textContent = sectionConfig[section].title;

    document.getElementById("dynamicPage").classList.add("active");

    renderSection(section);
}

function setupNavigation() {
    document.querySelectorAll(".nav-item").forEach(button => {
        button.addEventListener("click", () => {
            navigate(button.dataset.section);
        });
    });
}


// =============================================
// 5. VISÃO GERAL
// =============================================

function countRecords(array) {
    if (!Array.isArray(array)) return 0;

    return array.filter(item => {
        if (typeof item !== "object" || item === null) {
            return Boolean(item);
        }

        return Object.values(item).some(value => {
            if (Array.isArray(value)) return value.length > 0;
            return value !== "" && value !== null && value !== false;
        });
    }).length;
}

function renderOverview() {
    const personal = cv.personalInformation || {};
    const summary = cv.professionalSummary || {};

    document.getElementById("welcomeName").textContent =
        personal.fullName || "Nome não informado";

    document.getElementById("welcomeDescription").textContent =
        summary.description || "Adicione seu resumo profissional.";

    const skills = cv.skills || {};

    const totalSkills = Object.values(skills)
        .reduce((total, items) => total + countRecords(items), 0);

    const stats = [
        {
            label: "Experiências",
            value: countRecords(cv.professionalExperience)
        },
        {
            label: "Formações",
            value: countRecords(cv.education)
        },
        {
            label: "Habilidades",
            value: totalSkills
        },
        {
            label: "Projetos",
            value: countRecords(cv.projects)
        }
    ];

    document.getElementById("stats").innerHTML =
        stats.map(item => `
            <div class="stat-card">
                <span>${escapeHTML(item.label)}</span>
                <strong>${item.value}</strong>
            </div>
        `).join("");

    const location = personal.location || {};

    const details = [
        ["E-mail", personal.email],
        ["WhatsApp", personal.whatsapp],
        ["Localização", [
            location.city,
            location.state,
            location.country
        ].filter(Boolean).join(", ")],
        ["GitHub", personal.github],
        ["Especialização", summary.mainSpecialization],
        ["Experiência", `${summary.yearsOfExperience ?? 0} anos`]
    ];

    document.getElementById("overviewDetails").innerHTML =
        details.map(([label, value]) => `
            <div class="detail">
                <label>${escapeHTML(label)}</label>
                <strong>${escapeHTML(displayValue(value))}</strong>
            </div>
        `).join("");

    document.getElementById("overviewObjective").textContent =
        summary.careerObjective || "Nenhum objetivo informado.";
}


// =============================================
// 6. FORMULÁRIOS DINÂMICOS
// =============================================

function getTemplate(section) {
    const templates = {
        professionalExperience: {
            company: "",
            position: "",
            employmentType: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            responsibilities: [],
            achievements: [],
            technologies: []
        },

        education: {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            level: "",
            startDate: "",
            endDate: "",
            current: false,
            description: ""
        },

        languages: {
            name: "",
            proficiency: ""
        },

        certifications: {
            name: "",
            issuer: "",
            issueDate: "",
            expirationDate: "",
            credentialUrl: ""
        },

        projects: {
            name: "",
            description: "",
            role: "",
            technologies: [],
            url: "",
            startDate: "",
            endDate: ""
        },

        courses: {
            name: "",
            institution: "",
            completionDate: "",
            workloadHours: null
        }
    };

    return clone(templates[section] || {});
}


// =============================================
// 7. CONSTRUÇÃO DOS CAMPOS
// =============================================

function getFieldLabel(key) {
    const labels = {
        fullName: "Nome completo",
        professionalTitle: "Título profissional",
        profilePhoto: "Foto de perfil (URL)",
        email: "E-mail",
        phone: "Telefone",
        whatsapp: "WhatsApp",
        location: "Localização",
        city: "Cidade",
        state: "Estado",
        country: "País",
        address: "Endereço",
        linkedin: "LinkedIn",
        github: "GitHub",
        portfolio: "Portfólio",
        website: "Website",
        description: "Descrição",
        yearsOfExperience: "Anos de experiência",
        mainSpecialization: "Especialização principal",
        careerObjective: "Objetivo profissional",
        company: "Empresa",
        position: "Cargo",
        employmentType: "Tipo de contratação",
        startDate: "Data de início",
        endDate: "Data de término",
        current: "Atualmente?",
        responsibilities: "Responsabilidades",
        achievements: "Conquistas",
        technologies: "Tecnologias",
        institution: "Instituição",
        degree: "Grau / Semestre",
        fieldOfStudy: "Área de estudo",
        level: "Nível",
        proficiency: "Proficiência",
        name: "Nome",
        issuer: "Emissor",
        issueDate: "Data de emissão",
        expirationDate: "Data de validade",
        credentialUrl: "Link da credencial",
        role: "Função no projeto",
        url: "URL",
        completionDate: "Data de conclusão",
        workloadHours: "Carga horária",
        availability: "Disponibilidade",
        workModel: "Modelo de trabalho",
        travelAvailability: "Disponibilidade para viagens",
        additionalNotes: "Observações",
        targetPositions: "Cargos desejados",
        targetIndustries: "Setores de interesse",
        preferredLocations: "Localizações preferidas",
        preferredWorkModel: "Modelo de trabalho preferido",
        technical: "Técnicas",
        behavioral: "Comportamentais",
        tools: "Ferramentas",
        methodologies: "Metodologias"
    };

    return labels[key] || key;
}

function createField(key, value, path = "") {
    const label = getFieldLabel(key);

    const fullPath = path ? `${path}.${key}` : key;

    const isNested = value && typeof value === "object" &&
        !Array.isArray(value);

    if (isNested) {
        return `
            <div class="form-field full">
                <label>${escapeHTML(label)}</label>
                <div class="nested-fields">
                    ${Object.entries(value).map(([childKey, childValue]) =>
                        createField(childKey, childValue, fullPath)
                    ).join("")}
                </div>
            </div>
        `;
    }

    if (typeof value === "boolean") {
        return `
            <div class="form-field">
                <label>
                    <input type="checkbox"
                        name="${escapeHTML(fullPath)}"
                        ${value ? "checked" : ""}>
                    ${escapeHTML(label)}
                </label>
            </div>
        `;
    }

    if (Array.isArray(value)) {
        return `
            <div class="form-field full">
                <label>${escapeHTML(label)}</label>
                <textarea name="${escapeHTML(fullPath)}"
                    data-type="json"
                    placeholder='${escapeHTML(JSON.stringify(value))}'
                >${escapeHTML(JSON.stringify(value, null, 2))}</textarea>
                <small>Informe um array JSON válido.</small>
            </div>
        `;
    }

    const numberField = typeof value === "number" ||
        (key === "workloadHours" && value === null);

    const fieldValue = value ?? "";

    const inputType = numberField ? "number" : "text";

    return `
        <div class="form-field">
            <label>${escapeHTML(label)}</label>
            <input
                type="${inputType}"
                name="${escapeHTML(fullPath)}"
                value="${escapeHTML(fieldValue)}"
                ${numberField ? 'min="0"' : ""}
            >
        </div>
    `;
}


// =============================================
// 8. ABRIR E RENDERIZAR SEÇÕES
// =============================================

function renderSection(section) {
    const config = sectionConfig[section];

    document.getElementById("sectionTitle").textContent =
        config.title;

    document.getElementById("sectionDescription").textContent =
        config.description;

    document.getElementById("sectionForm").hidden = true;

    document.getElementById("addButton").hidden =
        config.type === "object";

    if (config.type === "object") {
        renderObjectForm(section);
        return;
    }

    if (config.type === "skills") {
        renderSkills();
        return;
    }

    renderRecords(section);
}


// =============================================
// 9. RENDERIZAR OBJETOS SIMPLES
// =============================================

function renderObjectForm(section) {
    const data = cv[section] || {};

    document.getElementById("records").innerHTML = "";

    document.getElementById("sectionForm").hidden = false;
    document.getElementById("formTitle").textContent =
        "Editar " + sectionConfig[section].title;

    document.getElementById("formFields").innerHTML =
        Object.entries(data).map(([key, value]) =>
            createField(key, value)
        ).join("");

    document.getElementById("recordForm").onsubmit = event => {
        event.preventDefault();

        const result = collectFormData(data);

        if (!result.success) {
            notify(result.message, true);
            return;
        }

        cv[section] = result.data;

        finishUpdate("Informações atualizadas!");
    };

    document.getElementById("cancelButton").onclick = () => {
        renderObjectForm(section);
    };
}


// =============================================
// 10. COLETAR DADOS DOS FORMULÁRIOS
// =============================================

function collectFormData(template) {
    const result = clone(template);

    const inputs = document.querySelectorAll(
        "#formFields [name]"
    );

    try {
        inputs.forEach(input => {
            const path = input.name.split(".");
            let target = result;

            for (let i = 0; i < path.length - 1; i++) {
                target = target[path[i]];
            }

            const key = path[path.length - 1];

            let value;

            if (input.type === "checkbox") {
                value = input.checked;
            } else if (input.dataset.type === "json") {
                value = JSON.parse(input.value || "[]");

                if (!Array.isArray(value)) {
                    throw new Error(
                        `O campo ${getFieldLabel(key)} precisa ser um array.`
                    );
                }
            } else if (input.type === "number") {
                value = input.value === "" ? null : Number(input.value);
            } else {
                value = input.value.trim();
            }

            target[key] = value;
        });

        return {
            success: true,
            data: result
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}


// =============================================
// 11. CRUD DE REGISTROS
// =============================================

function renderRecords(section) {
    const records = cv[section] || [];

    const container = document.getElementById("records");

    if (!records.length) {
        container.innerHTML = `
            <div class="empty-state">
                Nenhum registro cadastrado.<br>
                Clique em "Adicionar" para começar.
            </div>
        `;
        return;
    }

    container.innerHTML = records.map((record, index) => {
        const title = getRecordTitle(section, record);
        const subtitle = getRecordSubtitle(section, record);

        return `
            <div class="record-card">
                <div>
                    <h4>${escapeHTML(title)}</h4>
                    <p>${escapeHTML(subtitle)}</p>
                </div>

                <div class="record-actions">
                    <button class="btn btn-outline"
                        onclick="editRecord('${section}', ${index})">
                        Editar
                    </button>

                    <button class="btn btn-danger"
                        onclick="deleteRecord('${section}', ${index})">
                        Excluir
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function getRecordTitle(section, record) {
    const fields = {
        professionalExperience: record.position || record.company,
        education: record.institution,
        languages: record.name,
        certifications: record.name,
        projects: record.name,
        courses: record.name
    };

    return fields[section] || "Registro sem título";
}

function getRecordSubtitle(section, record) {
    const fields = {
        professionalExperience: record.company,
        education: record.fieldOfStudy,
        languages: record.proficiency,
        certifications: record.issuer,
        projects: record.role,
        courses: record.institution
    };

    return fields[section] || "";
}


// CREATE
function addRecord(section) {
    editingIndex = null;

    const template = getTemplate(section);

    openRecordForm(section, template, "Novo registro");
}

// UPDATE
function editRecord(section, index) {
    editingIndex = index;

    const record = clone(cv[section][index]);

    openRecordForm(section, record, "Editar registro");
}

// FORMULÁRIO
function openRecordForm(section, record, title) {
    document.getElementById("sectionForm").hidden = false;

    document.getElementById("formTitle").textContent = title;

    document.getElementById("formFields").innerHTML =
        Object.entries(record).map(([key, value]) =>
            createField(key, value)
        ).join("");

    document.getElementById("recordForm").onsubmit = event => {
        event.preventDefault();

        const result = collectFormData(record);

        if (!result.success) {
            notify(result.message, true);
            return;
        }

        if (editingIndex === null) {
            cv[section].push(result.data);
        } else {
            cv[section][editingIndex] = result.data;
        }

        finishUpdate("Registro salvo com sucesso!");
    };

    document.getElementById("cancelButton").onclick = () => {
        document.getElementById("sectionForm").hidden = true;
        renderRecords(section);
    };

    document.getElementById("sectionForm").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// DELETE
function deleteRecord(section, index) {
    const confirmation = confirm(
        "Tem certeza de que deseja excluir este registro?"
    );

    if (!confirmation) return;

    cv[section].splice(index, 1);

    finishUpdate("Registro excluído!");
}


// =============================================
// 12. CRUD DE HABILIDADES
// =============================================

function renderSkills() {
    const container = document.getElementById("records");

    container.innerHTML = Object.entries(skillConfig).map(
        ([category, label]) => {
            const records = cv.skills[category] || [];

            return `
                <div class="skill-category">
                    <div class="panel-header">
                        <h3>${escapeHTML(label)}</h3>

                        <button class="btn btn-primary"
                            onclick="addSkill('${category}')">
                            + Adicionar
                        </button>
                    </div>

                    ${records.length
                        ? records.map((skill, index) => `
                            <div class="record-card">
                                <div>
                                    <h4>${escapeHTML(skill.name)}</h4>
                                    <p>${escapeHTML(skill.level || "")}</p>
                                </div>

                                <div class="record-actions">
                                    <button class="btn btn-outline"
                                        onclick="editSkill('${category}', ${index})">
                                        Editar
                                    </button>

                                    <button class="btn btn-danger"
                                        onclick="deleteSkill('${category}', ${index})">
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        `).join("")
                        : '<div class="empty-state">Nenhuma habilidade cadastrada.</div>'
                    }
                </div>
            `;
        }
    ).join("");
}

function addSkill(category) {
    editingIndex = null;
    editingSkillCategory = category;

    openSkillForm({
        name: "",
        level: ""
    }, "Adicionar habilidade");
}

function editSkill(category, index) {
    editingIndex = index;
    editingSkillCategory = category;

    openSkillForm(
        clone(cv.skills[category][index]),
        "Editar habilidade"
    );
}

function openSkillForm(skill, title) {
    document.getElementById("sectionForm").hidden = false;

    document.getElementById("formTitle").textContent = title;

    document.getElementById("formFields").innerHTML =
        Object.entries(skill).map(([key, value]) =>
            createField(key, value)
        ).join("");

    document.getElementById("recordForm").onsubmit = event => {
        event.preventDefault();

        const result = collectFormData(skill);

        if (!result.success) {
            notify(result.message, true);
            return;
        }

        const category = editingSkillCategory;

        if (editingIndex === null) {
            cv.skills[category].push(result.data);
        } else {
            cv.skills[category][editingIndex] = result.data;
        }

        finishUpdate("Habilidade salva com sucesso!");
    };

    document.getElementById("cancelButton").onclick = () => {
        document.getElementById("sectionForm").hidden = true;
        renderSkills();
    };
}

function deleteSkill(category, index) {
    if (!confirm("Excluir esta habilidade?")) return;

    cv.skills[category].splice(index, 1);

    finishUpdate("Habilidade excluída!");
}


// =============================================
// 13. FINALIZAR ATUALIZAÇÕES
// =============================================

function finishUpdate(message) {
    updateMetadata();

    if (!saveData()) return;

    document.getElementById("sectionForm").hidden = true;

    if (currentSection === "overview") {
        renderOverview();
    } else {
        renderSection(currentSection);
    }

    notify(message);
}


// =============================================
// 14. ADICIONAR REGISTROS
// =============================================

document.getElementById("addButton").addEventListener(
    "click",
    () => {
        if (sectionConfig[currentSection]?.type === "array") {
            addRecord(currentSection);
        }
    }
);


// =============================================
// 15. EDITAR E SALVAR OBJETO COMPLETO
// =============================================

document.getElementById("saveButton").addEventListener(
    "click",
    () => {
        updateMetadata();

        if (saveData()) {
            notify("Currículo salvo com sucesso!");
            renderOverview();
        }
    }
);


// =============================================
// 16. EXPORTAR JSON
// =============================================

function exportJSON() {
    const blob = new Blob(
        [JSON.stringify(cv, null, 2)],
        { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "curriculo-enzo-ribeiro.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    notify("Arquivo JSON exportado!");
}

document.getElementById("exportButton").addEventListener(
    "click",
    exportJSON
);


// =============================================
// 17. EDITOR JSON
// =============================================

function loadJSONEditor() {
    document.getElementById("jsonEditor").value =
        JSON.stringify(cv, null, 2);
}

document.getElementById("reloadJSON").addEventListener(
    "click",
    loadJSONEditor
);

document.getElementById("formatButton").addEventListener(
    "click",
    () => {
        try {
            const input = document.getElementById("jsonEditor");

            input.value = JSON.stringify(
                JSON.parse(input.value),
                null,
                2
            );

            notify("JSON formatado!");
        } catch {
            notify("JSON inválido.", true);
        }
    }
);

document.getElementById("applyJSON").addEventListener(
    "click",
    () => {
        try {
            const parsed = JSON.parse(
                document.getElementById("jsonEditor").value
            );

            if (
                !parsed ||
                typeof parsed !== "object" ||
                Array.isArray(parsed) ||
                !parsed.personalInformation ||
                typeof parsed.personalInformation !== "object"
            ) {
                throw new Error(
                    "Estrutura de currículo inválida."
                );
            }

            cv = parsed;

            updateMetadata();

            if (saveData()) {
                navigate("overview");
                notify("JSON importado e aplicado com sucesso!");
            }

        } catch (error) {
            notify("Erro ao importar: " + error.message, true);
        }
    }
);


// =============================================
// 18. IMPORTAR ARQUIVO JSON
// =============================================

document.getElementById("importFile").addEventListener(
    "change",
    async event => {
        const file = event.target.files[0];

        if (!file) return;

        try {
            const content = await file.text();
            const parsed = JSON.parse(content);

            if (
                !parsed ||
                typeof parsed !== "object" ||
                Array.isArray(parsed) ||
                !parsed.personalInformation
            ) {
                throw new Error("Arquivo não contém um currículo válido.");
            }

            document.getElementById("jsonEditor").value =
                JSON.stringify(parsed, null, 2);

            notify("Arquivo carregado. Clique em Aplicar JSON para confirmar.");

        } catch (error) {
            notify(error.message, true);
        }

        event.target.value = "";
    }
);


// =============================================
// 19. INICIALIZAÇÃO
// =============================================

function initialize() {
    setupNavigation();

    renderOverview();

    navigate("overview");

    console.log("CV Manager iniciado.");
    console.log("Currículo carregado:", cv);
}

initialize();
