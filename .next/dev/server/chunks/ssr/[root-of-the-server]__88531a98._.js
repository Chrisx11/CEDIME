module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/CEDIME/lib/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const storedUser = localStorage.getItem('cedim_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch  {
                localStorage.removeItem('cedim_user');
            }
        }
        setIsLoading(false);
    }, []);
    const login = async (email, password)=>{
        setIsLoading(true);
        try {
            // Demo: Simulando autenticação
            if (email && password.length >= 6) {
                const newUser = {
                    id: Math.random().toString(36).substring(7),
                    name: email.split('@')[0],
                    email,
                    role: 'admin'
                };
                setUser(newUser);
                localStorage.setItem('cedim_user', JSON.stringify(newUser));
            } else {
                throw new Error('Credenciais inválidas');
            }
        } finally{
            setIsLoading(false);
        }
    };
    const logout = ()=>{
        setUser(null);
        localStorage.removeItem('cedim_user');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isLoading,
            login,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/lib/auth-context.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
}
}),
"[project]/Desktop/CEDIME/lib/data-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataProvider",
    ()=>DataProvider,
    "useData",
    ()=>useData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const DataContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function DataProvider({ children }) {
    const [suppliers, setSuppliers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [institutions, setInstitutions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [materials, setMaterials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [requests, setRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [outputs, setOutputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [customCategories, setCustomCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Dados iniciais (seed data)
    const getInitialData = ()=>{
        const initialSuppliers = [
            {
                id: 'supplier-1',
                name: 'Papelaria Central Ltda',
                cnpj: '12.345.678/0001-90',
                phone: '(11) 3456-7890',
                city: 'São Paulo',
                state: 'SP',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-2',
                name: 'Material Escolar Premium',
                cnpj: '23.456.789/0001-01',
                phone: '(21) 2345-6789',
                city: 'Rio de Janeiro',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-3',
                name: 'Distribuidora de Suprimentos Educacionais',
                cnpj: '34.567.890/0001-12',
                phone: '(31) 3456-7890',
                city: 'Belo Horizonte',
                state: 'MG',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-4',
                name: 'Tecnologia Educacional S.A.',
                cnpj: '45.678.901/0001-23',
                phone: '(41) 2345-6789',
                city: 'Curitiba',
                state: 'PR',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-5',
                name: 'Limpeza e Higiene Profissional',
                cnpj: '56.789.012/0001-34',
                phone: '(51) 3456-7890',
                city: 'Porto Alegre',
                state: 'RS',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        const initialMaterials = [
            {
                id: 'material-1',
                name: 'Caderno Universitário 200 folhas',
                category: 'escolar',
                description: 'Caderno espiral com capa dura, 200 folhas pautadas',
                unit: 'unidade',
                quantity: 150,
                minQuantity: 30,
                supplier: 'supplier-1',
                unitPrice: 12.50,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-2',
                name: 'Caneta Esferográfica Azul',
                category: 'escolar',
                description: 'Caneta esferográfica azul, ponta média',
                unit: 'unidade',
                quantity: 500,
                minQuantity: 100,
                supplier: 'supplier-1',
                unitPrice: 1.50,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-3',
                name: 'Lápis Preto HB',
                category: 'escolar',
                description: 'Lápis preto grafite HB, caixa com 12 unidades',
                unit: 'caixa',
                quantity: 80,
                minQuantity: 20,
                supplier: 'supplier-1',
                unitPrice: 8.90,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-4',
                name: 'Papel A4 75g',
                category: 'escritorio',
                description: 'Resma de papel A4, 75g, 500 folhas',
                unit: 'resma',
                quantity: 120,
                minQuantity: 30,
                supplier: 'supplier-2',
                unitPrice: 18.50,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-5',
                name: 'Borracha Branca',
                category: 'escolar',
                description: 'Borracha branca macia, formato tradicional',
                unit: 'unidade',
                quantity: 300,
                minQuantity: 50,
                supplier: 'supplier-2',
                unitPrice: 0.80,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-6',
                name: 'Régua 30cm',
                category: 'escolar',
                description: 'Régua de plástico transparente, 30cm',
                unit: 'unidade',
                quantity: 200,
                minQuantity: 40,
                supplier: 'supplier-2',
                unitPrice: 2.50,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-7',
                name: 'Apagador para Quadro',
                category: 'escolar',
                description: 'Apagador de quadro branco, feltro',
                unit: 'unidade',
                quantity: 45,
                minQuantity: 10,
                supplier: 'supplier-3',
                unitPrice: 5.90,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-8',
                name: 'Giz Branco',
                category: 'escolar',
                description: 'Caixa com 12 unidades de giz branco',
                unit: 'caixa',
                quantity: 60,
                minQuantity: 15,
                supplier: 'supplier-3',
                unitPrice: 4.50,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-9',
                name: 'Marca-texto Amarelo',
                category: 'escolar',
                description: 'Marca-texto amarelo, ponta chata',
                unit: 'unidade',
                quantity: 250,
                minQuantity: 50,
                supplier: 'supplier-3',
                unitPrice: 2.20,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-10',
                name: 'Notebook Educacional',
                category: 'tecnologia',
                description: 'Notebook 15.6", Intel Core i5, 8GB RAM, 256GB SSD',
                unit: 'unidade',
                quantity: 25,
                minQuantity: 5,
                supplier: 'supplier-4',
                unitPrice: 2899.00,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-11',
                name: 'Projetor Multimídia',
                category: 'tecnologia',
                description: 'Projetor Full HD, 3500 lumens, HDMI',
                unit: 'unidade',
                quantity: 12,
                minQuantity: 3,
                supplier: 'supplier-4',
                unitPrice: 1899.00,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-12',
                name: 'Tablet Educacional',
                category: 'tecnologia',
                description: 'Tablet 10", Android, 32GB, Wi-Fi',
                unit: 'unidade',
                quantity: 40,
                minQuantity: 8,
                supplier: 'supplier-4',
                unitPrice: 699.00,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-13',
                name: 'Detergente Líquido',
                category: 'limpeza',
                description: 'Detergente líquido neutro, 5 litros',
                unit: 'litro',
                quantity: 80,
                minQuantity: 20,
                supplier: 'supplier-5',
                unitPrice: 12.90,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-14',
                name: 'Álcool em Gel 70%',
                category: 'limpeza',
                description: 'Álcool em gel 70%, frasco 500ml',
                unit: 'unidade',
                quantity: 150,
                minQuantity: 30,
                supplier: 'supplier-5',
                unitPrice: 8.50,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-15',
                name: 'Papel Toalha',
                category: 'limpeza',
                description: 'Rolo de papel toalha, 2 folhas, pacote com 6 unidades',
                unit: 'pacote',
                quantity: 100,
                minQuantity: 25,
                supplier: 'supplier-5',
                unitPrice: 15.90,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-16',
                name: 'Bola de Futebol',
                category: 'esportes',
                description: 'Bola de futebol oficial, tamanho 5',
                unit: 'unidade',
                quantity: 30,
                minQuantity: 8,
                supplier: 'supplier-3',
                unitPrice: 45.00,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-17',
                name: 'Tinta Guache 12 Cores',
                category: 'escolar',
                description: 'Kit com 12 potes de tinta guache, 12ml cada',
                unit: 'kit',
                quantity: 50,
                minQuantity: 12,
                supplier: 'supplier-2',
                unitPrice: 18.90,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-18',
                name: 'Cola Branca Escolar',
                category: 'escolar',
                description: 'Cola branca líquida, frasco 90g',
                unit: 'unidade',
                quantity: 180,
                minQuantity: 40,
                supplier: 'supplier-1',
                unitPrice: 3.50,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-19',
                name: 'Tesoura Escolar',
                category: 'escolar',
                description: 'Tesoura escolar com ponta arredondada, 13cm',
                unit: 'unidade',
                quantity: 120,
                minQuantity: 25,
                supplier: 'supplier-1',
                unitPrice: 4.90,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'material-20',
                name: 'Mochila Escolar',
                category: 'escolar',
                description: 'Mochila escolar com alças acolchoadas, 2 compartimentos',
                unit: 'unidade',
                quantity: 35,
                minQuantity: 8,
                supplier: 'supplier-2',
                unitPrice: 89.90,
                lastUpdate: new Date().toISOString()
            }
        ];
        const initialInstitutions = [
            {
                id: 'institution-1',
                name: 'Escola Municipal João Silva',
                type: 'school',
                cnpj: '11.222.333/0001-44',
                email: 'contato@escolajoao.com.br',
                phone: '(11) 3456-7890',
                address: 'Rua das Flores, 123',
                city: 'São Paulo',
                principalName: 'Maria Santos',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-2',
                name: 'Centro Educacional Primavera',
                type: 'center',
                cnpj: '22.333.444/0001-55',
                email: 'secretaria@primavera.edu.br',
                phone: '(21) 2345-6789',
                address: 'Avenida Central, 456',
                city: 'Rio de Janeiro',
                principalName: 'José Oliveira',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-3',
                name: 'Escola Estadual Dom Pedro II',
                type: 'school',
                cnpj: '33.444.555/0001-66',
                email: 'escola@dompedro.edu.br',
                phone: '(31) 3456-7890',
                address: 'Praça da Liberdade, 789',
                city: 'Belo Horizonte',
                principalName: 'Ana Costa',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-4',
                name: 'Colégio Municipal Nossa Senhora Aparecida',
                type: 'school',
                cnpj: '44.555.666/0001-77',
                email: 'colegio@nsaparecida.com.br',
                phone: '(41) 2345-6789',
                address: 'Rua dos Estudantes, 321',
                city: 'Curitiba',
                principalName: 'Carlos Mendes',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-5',
                name: 'Centro de Educação Infantil Pequenos Passos',
                type: 'center',
                cnpj: '55.666.777/0001-88',
                email: 'cei@pequenospassos.com.br',
                phone: '(51) 3456-7890',
                address: 'Avenida das Crianças, 654',
                city: 'Porto Alegre',
                principalName: 'Patrícia Lima',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-6',
                name: 'Escola Municipal Professora Maria da Silva',
                type: 'school',
                cnpj: '66.777.888/0001-99',
                email: 'escola@profmaria.com.br',
                phone: '(85) 2345-6789',
                address: 'Rua da Educação, 987',
                city: 'Fortaleza',
                principalName: 'Roberto Alves',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-7',
                name: 'Instituto Educacional Futuro Brilhante',
                type: 'other',
                cnpj: '77.888.999/0001-00',
                email: 'contato@futurobrilhante.edu.br',
                phone: '(47) 3456-7890',
                address: 'Avenida do Futuro, 147',
                city: 'Joinville',
                principalName: 'Fernanda Rocha',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-8',
                name: 'Escola Municipal Rural São José',
                type: 'school',
                cnpj: '88.999.000/0001-11',
                email: 'rural@saojose.com.br',
                phone: '(62) 2345-6789',
                address: 'Estrada Rural, Km 12',
                city: 'Goiânia',
                principalName: 'Paulo Ferreira',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        return {
            initialSuppliers,
            initialMaterials,
            initialInstitutions
        };
    };
    // Carregar categorias customizadas
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const storedCategories = localStorage.getItem('cedim_custom_categories');
        if (storedCategories) {
            try {
                setCustomCategories(JSON.parse(storedCategories));
            } catch (e) {
                console.error('Erro ao carregar categorias customizadas:', e);
            }
        }
    }, []);
    // Salvar categorias customizadas
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (customCategories.length > 0 || localStorage.getItem('cedim_custom_categories')) {
            localStorage.setItem('cedim_custom_categories', JSON.stringify(customCategories));
        }
    }, [
        customCategories
    ]);
    // Carregar dados do localStorage ou usar dados iniciais
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isInitialized) return;
        const stored = localStorage.getItem('cedim_data');
        const { initialSuppliers, initialMaterials, initialInstitutions } = getInitialData();
        if (stored) {
            try {
                const data = JSON.parse(stored);
                // Verificar se já tem dados ou se precisa popular
                const hasSuppliers = data.suppliers && Array.isArray(data.suppliers) && data.suppliers.length > 0;
                const hasMaterials = data.materials && Array.isArray(data.materials) && data.materials.length > 0;
                const hasInstitutions = data.institutions && Array.isArray(data.institutions) && data.institutions.length > 0;
                // Sempre popular se não tiver dados
                if (!hasSuppliers) {
                    setSuppliers(initialSuppliers);
                } else {
                    // Remover emails e addresses de fornecedores antigos (compatibilidade)
                    const cleanedSuppliers = data.suppliers.map((s)=>{
                        const { email, address, ...rest } = s;
                        // Se não tiver state, tentar inferir da cidade ou usar vazio
                        if (!rest.state) {
                            rest.state = '';
                        }
                        return rest;
                    });
                    setSuppliers(cleanedSuppliers);
                }
                if (!hasMaterials) {
                    setMaterials(initialMaterials);
                } else {
                    setMaterials(data.materials);
                }
                if (!hasInstitutions) {
                    setInstitutions(initialInstitutions);
                } else {
                    setInstitutions(data.institutions);
                }
                setRequests(data.requests || []);
                setOutputs(data.outputs || []);
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
                // Se houver erro, usar dados iniciais
                setSuppliers(initialSuppliers);
                setMaterials(initialMaterials);
                setInstitutions(initialInstitutions);
                setRequests([]);
            }
        } else {
            // Se não houver dados salvos, usar dados iniciais
            setSuppliers(initialSuppliers);
            setMaterials(initialMaterials);
            setInstitutions(initialInstitutions);
            setRequests([]);
        }
        setIsInitialized(true);
    }, [
        isInitialized
    ]);
    // Salvar dados no localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('cedim_data', JSON.stringify({
            suppliers,
            institutions,
            materials,
            requests,
            outputs
        }));
    }, [
        suppliers,
        institutions,
        materials,
        requests,
        outputs
    ]);
    const addCustomCategory = (category)=>{
        const trimmedCategory = category.trim();
        if (trimmedCategory && !customCategories.includes(trimmedCategory)) {
            setCustomCategories([
                ...customCategories,
                trimmedCategory
            ]);
        }
    };
    const addSupplier = (supplier)=>{
        // Remover email e address se existirem (compatibilidade com dados antigos)
        const { email, address, ...supplierCleaned } = supplier;
        setSuppliers([
            ...suppliers,
            {
                ...supplierCleaned,
                id: Math.random().toString(36).substring(7),
                createdAt: new Date().toISOString()
            }
        ]);
    };
    const updateSupplier = (id, updates)=>{
        // Remover email e address se existirem (compatibilidade com dados antigos)
        const { email, address, ...cleanedUpdates } = updates;
        setSuppliers(suppliers.map((s)=>s.id === id ? {
                ...s,
                ...cleanedUpdates
            } : s));
    };
    const deleteSupplier = (id)=>{
        setSuppliers(suppliers.filter((s)=>s.id !== id));
    };
    const addInstitution = (institution)=>{
        setInstitutions([
            ...institutions,
            {
                ...institution,
                id: Math.random().toString(36).substring(7),
                createdAt: new Date().toISOString()
            }
        ]);
    };
    const updateInstitution = (id, updates)=>{
        setInstitutions(institutions.map((i)=>i.id === id ? {
                ...i,
                ...updates
            } : i));
    };
    const deleteInstitution = (id)=>{
        setInstitutions(institutions.filter((i)=>i.id !== id));
    };
    const addMaterial = (material)=>{
        setMaterials([
            ...materials,
            {
                ...material,
                id: Math.random().toString(36).substring(7),
                lastUpdate: new Date().toISOString()
            }
        ]);
    };
    const updateMaterial = (id, updates)=>{
        setMaterials(materials.map((m)=>m.id === id ? {
                ...m,
                ...updates,
                lastUpdate: new Date().toISOString()
            } : m));
    };
    const deleteMaterial = (id)=>{
        setMaterials(materials.filter((m)=>m.id !== id));
    };
    const addRequest = (request)=>{
        // Garantir número único usando timestamp + número aleatório
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const requestNumber = `REQ-${timestamp}-${random}`;
        const id = Math.random().toString(36).substring(7);
        setRequests((prev)=>{
            // Verificar se já existe uma requisição com o mesmo número (muito improvável, mas seguro)
            const exists = prev.some((r)=>r.requestNumber === requestNumber);
            if (exists) {
                // Se existir, gerar novo número
                const newRandom = Math.random().toString(36).substring(2, 8);
                const newRequestNumber = `REQ-${timestamp}-${newRandom}`;
                return [
                    ...prev,
                    {
                        ...request,
                        id,
                        requestNumber: newRequestNumber,
                        createdAt: new Date().toISOString()
                    }
                ];
            }
            return [
                ...prev,
                {
                    ...request,
                    id,
                    requestNumber,
                    createdAt: new Date().toISOString()
                }
            ];
        });
    };
    const addRequests = (requestsData)=>{
        // Criar múltiplas requisições de uma vez para garantir que todas sejam adicionadas
        const baseTimestamp = Date.now();
        const newRequests = requestsData.map((request, index)=>{
            const random = Math.random().toString(36).substring(2, 8);
            // Adicionar um pequeno offset ao timestamp para garantir unicidade
            const requestNumber = `REQ-${baseTimestamp + index}-${random}`;
            const id = Math.random().toString(36).substring(7);
            return {
                ...request,
                id,
                requestNumber,
                createdAt: new Date().toISOString()
            };
        });
        setRequests((prev)=>[
                ...prev,
                ...newRequests
            ]);
    };
    const updateRequest = (id, updates)=>{
        setRequests(requests.map((r)=>r.id === id ? {
                ...r,
                ...updates
            } : r));
    };
    const deleteRequest = (id)=>{
        setRequests(requests.filter((r)=>r.id !== id));
    };
    const addOutput = (output)=>{
        const id = Math.random().toString(36).substring(7);
        // Atualizar estoque do material
        const material = materials.find((m)=>m.id === output.materialId);
        if (material) {
            const newQuantity = Math.max(0, material.quantity - output.quantity);
            updateMaterial(output.materialId, {
                quantity: newQuantity
            });
        }
        setOutputs((prev)=>[
                ...prev,
                {
                    ...output,
                    id,
                    createdAt: new Date().toISOString()
                }
            ]);
    };
    const updateOutput = (id, updates)=>{
        setOutputs(outputs.map((o)=>o.id === id ? {
                ...o,
                ...updates
            } : o));
    };
    const deleteOutput = (id)=>{
        const output = outputs.find((o)=>o.id === id);
        if (output) {
            // Restaurar estoque do material
            const material = materials.find((m)=>m.id === output.materialId);
            if (material) {
                updateMaterial(output.materialId, {
                    quantity: material.quantity + output.quantity
                });
            }
        }
        setOutputs(outputs.filter((o)=>o.id !== id));
    };
    const seedInitialData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const { initialSuppliers, initialMaterials, initialInstitutions } = getInitialData();
        // Adicionar apenas se não existirem
        setSuppliers((prev)=>{
            if (prev.length === 0) {
                return initialSuppliers;
            }
            return prev;
        });
        setMaterials((prev)=>{
            if (prev.length === 0) {
                return initialMaterials;
            }
            return prev;
        });
        setInstitutions((prev)=>{
            if (prev.length === 0) {
                return initialInstitutions;
            }
            return prev;
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DataContext.Provider, {
        value: {
            suppliers,
            institutions,
            materials,
            requests,
            customCategories,
            addSupplier,
            updateSupplier,
            deleteSupplier,
            addInstitution,
            updateInstitution,
            deleteInstitution,
            addMaterial,
            updateMaterial,
            deleteMaterial,
            addRequest,
            addRequests,
            updateRequest,
            deleteRequest,
            outputs,
            addOutput,
            updateOutput,
            deleteOutput,
            addCustomCategory,
            seedInitialData
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/lib/data-context.tsx",
        lineNumber: 778,
        columnNumber: 5
    }, this);
}
function useData() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(DataContext);
    if (!context) {
        throw new Error('useData deve ser usado dentro de DataProvider');
    }
    return context;
}
}),
"[project]/Desktop/CEDIME/lib/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/lib/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$data$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/lib/data-context.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$data$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/Desktop/CEDIME/lib/providers.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/lib/providers.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/CEDIME/hooks/use-toast.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST'
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case 'DISMISS_TOAST':
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: 'UPDATE_TOAST',
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: 'DISMISS_TOAST',
            toastId: id
        });
    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: 'DISMISS_TOAST',
                toastId
            })
    };
}
;
}),
"[project]/Desktop/CEDIME/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "maskCNPJ",
    ()=>maskCNPJ,
    "maskPhone",
    ()=>maskPhone,
    "unmaskCNPJ",
    ()=>unmaskCNPJ,
    "unmaskPhone",
    ()=>unmaskPhone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function maskCNPJ(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
        return numbers;
    } else if (numbers.length <= 5) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    } else if (numbers.length <= 12) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    } else {
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }
}
function maskPhone(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) {
        return '';
    } else if (numbers.length <= 2) {
        return `(${numbers}`;
    } else if (numbers.length <= 6) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
        // Telefone com 11 dígitos (celular com 9 dígitos)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
}
function unmaskCNPJ(value) {
    return value.replace(/\D/g, '');
}
function unmaskPhone(value) {
    return value.replace(/\D/g, '');
}
}),
"[project]/Desktop/CEDIME/components/ui/toast.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toast",
    ()=>Toast,
    "ToastAction",
    ()=>ToastAction,
    "ToastClose",
    ()=>ToastClose,
    "ToastDescription",
    ()=>ToastDescription,
    "ToastProvider",
    ()=>ToastProvider,
    "ToastTitle",
    ()=>ToastTitle,
    "ToastViewport",
    ()=>ToastViewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/@radix-ui/react-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])('group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full', {
    variants: {
        variant: {
            default: 'border bg-background text-foreground',
            destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
const Toast = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600', className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-sm font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-sm opacity-90', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}),
"[project]/Desktop/CEDIME/components/ui/toaster.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/hooks/use-toast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/components/ui/toast.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function Toaster() {
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/CEDIME/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/CEDIME/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/CEDIME/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/Desktop/CEDIME/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/Desktop/CEDIME/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/Desktop/CEDIME/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__88531a98._.js.map