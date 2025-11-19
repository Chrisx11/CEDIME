(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/CEDIME/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const storedUser = localStorage.getItem('cedim_user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch  {
                    localStorage.removeItem('cedim_user');
                }
            }
            setIsLoading(false);
        }
    }["AuthProvider.useEffect"], []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
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
_s(AuthProvider, "YajQB7LURzRD+QP5gw0+K2TZIWA=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/CEDIME/lib/data-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataProvider",
    ()=>DataProvider,
    "useData",
    ()=>useData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const DataContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function DataProvider({ children }) {
    _s();
    const [suppliers, setSuppliers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [institutions, setInstitutions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [materials, setMaterials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [requests, setRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [outputs, setOutputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [customCategories, setCustomCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Dados iniciais (seed data)
    const getInitialData = ()=>{
        // Fornecedores
        const initialSuppliers = [
            {
                id: 'supplier-1',
                name: 'BOM BEEF-MENDEL',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-2',
                name: 'ALPHES',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-3',
                name: 'ALMERINDO',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-4',
                name: 'BR-LIFE',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-5',
                name: 'CMR - THIERRY',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-6',
                name: 'COMERCIAL-DESTAQUE',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-7',
                name: 'COPAFI',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-8',
                name: 'DELBA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-9',
                name: 'DO FILHO - DDG',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-10',
                name: 'FABIANA-BANANA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-11',
                name: 'GÉLSON - AGRICULTURA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-12',
                name: 'GUIMARÃES PADARIA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-13',
                name: 'HLL-IGOR',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-14',
                name: 'IMPA-BILINHO',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-15',
                name: 'LEONILDO-AGRICULTURA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-16',
                name: 'LINDOMAR',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-17',
                name: 'M.A APARECIDA - BILINHO',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-18',
                name: 'MA-MARQUINHO',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-19',
                name: 'MARIANA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-20',
                name: 'MILENA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-21',
                name: 'PETRO QUEIROZ-GÁS',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-22',
                name: 'PICA - PAU',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-23',
                name: 'RO-SACOMAN',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-24',
                name: 'SÃO FRANCISCANA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-25',
                name: 'TONINHO RESENDE',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-26',
                name: 'T-SOARES-MARQUINHO',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-27',
                name: 'ÚNICA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-28',
                name: 'UTIBRINK-JOSELMO',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-29',
                name: 'VANDERSON ROCHA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-30',
                name: 'WILSON RICARDO',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'supplier-31',
                name: 'WS-CALDEIRA',
                cnpj: '00.000.000/0000-00',
                phone: '(00) 00000-0000',
                city: 'ITALVA',
                state: 'RJ',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        // Instituições
        const initialInstitutions = [
            {
                id: 'institution-1',
                name: 'GLYCERIO SALLES',
                type: 'school',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-2',
                name: 'SÃO PEDRO',
                type: 'school',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-3',
                name: 'SECRETARIA DE EDUCAÇÃO',
                type: 'other',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-4',
                name: 'SEVERINO',
                type: 'school',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-5',
                name: 'TRANSPORTE ESCOLAR',
                type: 'other',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-6',
                name: 'VOVÓ CELITA',
                type: 'school',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-7',
                name: 'CRECHE',
                type: 'center',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-8',
                name: 'DR MATTOS',
                type: 'school',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-9',
                name: 'JOÃO BARCELOS',
                type: 'school',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'institution-10',
                name: 'ANTÔNIO FERREIRA',
                type: 'school',
                cnpj: '00.000.000/0000-00',
                email: '',
                phone: '(00) 00000-0000',
                address: '',
                city: 'ITALVA',
                principalName: '',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        // Produtos cadastrados
        const initialMaterials = [
            // ALIMENTO PERECÍVEL
            {
                id: 'mat-1',
                name: 'AIPIM',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-2',
                name: 'ABÓBORA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-3',
                name: 'ABACATE',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-4',
                name: 'ABOBRINHA VERDE',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-5',
                name: 'ALFACE',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-6',
                name: 'ALHO',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-7',
                name: 'BANANA PRATA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-8',
                name: 'BATATA INGLESA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-9',
                name: 'BATATA DOCE',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-10',
                name: 'BETERRABA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-11',
                name: 'CEBOLA BRANCA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-12',
                name: 'CEBOLINHA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-13',
                name: 'CENOURA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-14',
                name: 'CHUCHU',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-15',
                name: 'COLORAL',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-16',
                name: 'COUVE VERDE',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-17',
                name: 'INHAME',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-18',
                name: 'LARANJA LIMA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-19',
                name: 'MAÇA VERMELHA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-20',
                name: 'MAMÃO FORMOSA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-21',
                name: 'MANGA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-22',
                name: 'MELANCIA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-23',
                name: 'PIMENTÃO',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-24',
                name: 'REPOLHO',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-25',
                name: 'SALSA',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-26',
                name: 'TOMATE',
                category: 'ALIMENTO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            // ALIMENTO NÃO PERECÍVEL
            {
                id: 'mat-27',
                name: 'ARROZ BRANCO',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-28',
                name: 'AMIDO DE MILHO',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-29',
                name: 'AÇUCAR',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-30',
                name: 'MUCILAGEM',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-31',
                name: 'AVEIA EM FLOCOS',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-32',
                name: 'AZEITE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-33',
                name: 'AZEITONA VERDE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-34',
                name: 'BISCOITO SAL',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-35',
                name: 'BISCOITO DOCE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-36',
                name: 'CANJICA AMARELO',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-37',
                name: 'CANJICA BRANCA',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-38',
                name: 'CREME DE LEITE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-39',
                name: 'EXTRATO TOMATE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-40',
                name: 'FARINHA MANDIOCA',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-41',
                name: 'FARINHA QUIBE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-42',
                name: 'FARINHA DE TRIGO',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-43',
                name: 'FARINHA LACTEA',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-44',
                name: 'FEIJÃO PRETO',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-45',
                name: 'FEIJÃOVERMELHO',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-46',
                name: 'FUBÁ',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-47',
                name: 'MACARRÃO PARAFUSO',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-48',
                name: 'MACARRÃO ESPAGUETE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-49',
                name: 'MACARRÃO ARGOLINHA',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-50',
                name: 'MILHO PIPOCA',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-51',
                name: 'MILHO VERDE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-52',
                name: 'MOLHO TOMATE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-53',
                name: 'MULTI CEREAIS',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-54',
                name: 'OLEO SOJA',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-55',
                name: 'PÓ CAFÉ',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-56',
                name: 'SAL',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-57',
                name: 'SUCO MARACUJA',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-58',
                name: 'SUCO CAJU',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-59',
                name: 'SUCO PESSEGO',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-60',
                name: 'SUCO DE MANGA',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-61',
                name: 'SUCO DE UVA INTEGRAL',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-62',
                name: 'VINAGRE',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-63',
                name: 'SUPLEMENTO INFANTIL',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-64',
                name: 'FERMENTO EM PÓ',
                category: 'ALIMENTO NÃO PERECÍVEL',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            // LATICÍNIOS
            {
                id: 'mat-65',
                name: 'IOGURTE',
                category: 'LATICÍNIOS',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-66',
                name: 'LEITE EM PÓ',
                category: 'LATICÍNIOS',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-67',
                name: 'LEITE PASTEURIZADO',
                category: 'LATICÍNIOS',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-68',
                name: 'MANTEIGA',
                category: 'LATICÍNIOS',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-69',
                name: 'MARGARINA VEGETAL',
                category: 'LATICÍNIOS',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            // PROTEÍNAS
            {
                id: 'mat-70',
                name: 'FRANGO',
                category: 'PROTEÍNAS',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-71',
                name: 'PATINHO PICADO',
                category: 'PROTEÍNAS',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-72',
                name: 'PATINHO MOÍDO',
                category: 'PROTEÍNAS',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-73',
                name: 'PEIXE',
                category: 'PROTEÍNAS',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-74',
                name: 'OVOS',
                category: 'PROTEÍNAS',
                unit: 'dúzia',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            // MATERIAL LIMPEZA
            {
                id: 'mat-75',
                name: 'AMACIANTE',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-76',
                name: 'ÁLCOOL 70%',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-77',
                name: 'ÁGUA SANITÁRIA',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-78',
                name: 'ÁLCOOL GEL',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-79',
                name: 'CERA LÍQUIDA INCOLOR',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-80',
                name: 'CLORO',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-81',
                name: 'CONDICIONADOR INFANTIL',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-82',
                name: 'CREME DENTAL',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-83',
                name: 'CREME DERMATOLÓGICO',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-84',
                name: 'DESINFETANTE',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-85',
                name: 'DETERGENTE',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-86',
                name: 'ESPONJA DE AÇO',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-87',
                name: 'ESPONJA MULTIUSO',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-88',
                name: 'FLANELA',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-89',
                name: 'FÓSFORO',
                category: 'MATERIAL LIMPEZA',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-90',
                name: 'FRALDA G',
                category: 'MATERIAL LIMPEZA',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-91',
                name: 'FRALDA GG',
                category: 'MATERIAL LIMPEZA',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-92',
                name: 'FRALDA M',
                category: 'MATERIAL LIMPEZA',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-93',
                name: 'FRALDA P',
                category: 'MATERIAL LIMPEZA',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-94',
                name: 'FRALDA XG',
                category: 'MATERIAL LIMPEZA',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-95',
                name: 'FRALDA XXG',
                category: 'MATERIAL LIMPEZA',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-96',
                name: 'INSETICIDA',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-97',
                name: 'LÂMPADA LED 50W',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-98',
                name: 'LENÇO UMEDECIDO',
                category: 'MATERIAL LIMPEZA',
                unit: 'pacote',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-99',
                name: 'LIMPADOR MULTIUSO',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-100',
                name: 'LIXEIRA 10L',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-101',
                name: 'LIXEIRA 120L',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-102',
                name: 'LIXEIRA 240 L',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-103',
                name: 'LIXEIRA 50L',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-104',
                name: 'LUVA LIMPEZA',
                category: 'MATERIAL LIMPEZA',
                unit: 'par',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-105',
                name: 'OLÉO INFANTIL',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-106',
                name: 'PA DE LIXO',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-107',
                name: 'PANO CHÃO',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-108',
                name: 'PANO DE PRATO',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-109',
                name: 'PANO LIMPEZA',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-110',
                name: 'PAPEL ALUMÍNIO',
                category: 'MATERIAL LIMPEZA',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-111',
                name: 'PAPEL HIGIENICO',
                category: 'MATERIAL LIMPEZA',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-112',
                name: 'PAPEL INTERFOLHADO',
                category: 'MATERIAL LIMPEZA',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-113',
                name: 'PAPEL TOALHA BANHEIRO',
                category: 'MATERIAL LIMPEZA',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-114',
                name: 'PAPEL TOALHA COZINHA',
                category: 'MATERIAL LIMPEZA',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-115',
                name: 'PLAFONIER',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-116',
                name: 'PREGADOR DE ROUPA',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-117',
                name: 'REGULADOR DE GÁS',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-118',
                name: 'RODO',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-119',
                name: 'ROLO SACOLA ALIMENTO',
                category: 'MATERIAL LIMPEZA',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-120',
                name: 'SABÃO DE COCO',
                category: 'MATERIAL LIMPEZA',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-121',
                name: 'SABÃO EM BARRA',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-122',
                name: 'SABÃO EM PO',
                category: 'MATERIAL LIMPEZA',
                unit: 'kg',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-123',
                name: 'SABONETE LÍQUIDO',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-124',
                name: 'SACO LIXO 100L',
                category: 'MATERIAL LIMPEZA',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-125',
                name: 'SACO LIXO 200L',
                category: 'MATERIAL LIMPEZA',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-126',
                name: 'SACO LIXO 50L',
                category: 'MATERIAL LIMPEZA',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-127',
                name: 'SHAMPOO',
                category: 'MATERIAL LIMPEZA',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-128',
                name: 'TALCO',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-129',
                name: 'TOUCA',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-130',
                name: 'VASSOURA',
                category: 'MATERIAL LIMPEZA',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            // MATERIAL ESCOLAR
            {
                id: 'mat-131',
                name: 'APLICADOR DE COLA QUENTE',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-132',
                name: 'A4 COLORIDO',
                category: 'MATERIAL ESCOLAR',
                unit: 'resma',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-133',
                name: 'A4 BRANCO',
                category: 'MATERIAL ESCOLAR',
                unit: 'resma',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-134',
                name: 'APAGADOR P/ QUADRO BRANCO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-135',
                name: 'APONTADOR',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-136',
                name: 'APONTADOR COM DEPOSITO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-137',
                name: 'BARBANTE',
                category: 'MATERIAL ESCOLAR',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-138',
                name: 'BASTÃO COLA QUENTE FINA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-139',
                name: 'BASTÃO COLA QUENTE GROSSA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-140',
                name: 'BLOCO PEDIDO COMERCIAL',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-141',
                name: 'BORRACHA BRANCA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-142',
                name: 'CADERNO BROCHURA PEQUENO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-143',
                name: 'CADERNO DE CALIGRAFIA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-144',
                name: 'CADERNO UNIVERSITARIO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-145',
                name: 'CAIXA P/ ARQUIVO MORTO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-146',
                name: 'CANETA BPS',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-147',
                name: 'CANETA ESFEROGRÁFICA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-148',
                name: 'CANETA QUADRO AZUL',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-149',
                name: 'CANETA QUADRO PRETA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-150',
                name: 'CANETA QUADRO VERMELHA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-151',
                name: 'CANETINHA HIDROCOR',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-152',
                name: 'CAPA ENCADERNAÇÃO PRETA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-153',
                name: 'CAPA ENCADERNAÇÃO TRANSPARENTE',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-154',
                name: 'CARTOLINA DUPLA FACE',
                category: 'MATERIAL ESCOLAR',
                unit: 'folha',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-155',
                name: 'CLIPS 1/0',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-156',
                name: 'CLIPS 2/0',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-157',
                name: 'CLIPS 3/0',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-158',
                name: 'CLIPS 4/0',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-159',
                name: 'COLA BASTÃO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-160',
                name: 'COLA BRANCA 500G',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-161',
                name: 'COLA BRANCA 90G',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-162',
                name: 'COLA COLORIDA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-163',
                name: 'COLA GLITTER',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-164',
                name: 'COLA ISOPOR',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-165',
                name: 'COLOR JET BRANCO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-166',
                name: 'COLOR JET CINZA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-167',
                name: 'COLOR JET DOURADO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-168',
                name: 'COLOR JET PRATA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-169',
                name: 'COLOR JET PRETO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-170',
                name: 'COLOR JET VERMELHO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-171',
                name: 'CORRETIVO FITA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-172',
                name: 'ENVELOPE A4 BRANCO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-173',
                name: 'ENVELOPE A4 OURO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-174',
                name: 'ENVELOPE PLASTICO A4',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-175',
                name: 'EVA FOSCO',
                category: 'MATERIAL ESCOLAR',
                unit: 'folha',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-176',
                name: 'EVA GLITTER',
                category: 'MATERIAL ESCOLAR',
                unit: 'folha',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-177',
                name: 'FITA ADESIVA 12MM',
                category: 'MATERIAL ESCOLAR',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-178',
                name: 'FITA ADESIVA 48MM',
                category: 'MATERIAL ESCOLAR',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-179',
                name: 'FITA ADESIVA 48MM MARROM',
                category: 'MATERIAL ESCOLAR',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-180',
                name: 'FITA ADESIVA COLORIDA',
                category: 'MATERIAL ESCOLAR',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-181',
                name: 'FITA CREPE BRANCA',
                category: 'MATERIAL ESCOLAR',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-182',
                name: 'FOLHA A4 ADESIVA',
                category: 'MATERIAL ESCOLAR',
                unit: 'folha',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-183',
                name: 'GIZ DE CERA',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-184',
                name: 'GRAMPEADOR ALICATE',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-185',
                name: 'GRAMPEADOR ROCAMA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-186',
                name: 'GRAMPO 106/6',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-187',
                name: 'GRAMPO 23/13',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-188',
                name: 'GRAMPO 26/6',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-189',
                name: 'GRAMPO DE PASTA',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-190',
                name: 'LÁPIS DE COR',
                category: 'MATERIAL ESCOLAR',
                unit: 'caixa',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-191',
                name: 'LÁPIS JUMBO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-192',
                name: 'LÁPIS PRETO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-193',
                name: 'LIVRO DE ATA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-194',
                name: 'LIVRO DE PONTO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-195',
                name: 'MARCA TEXTO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-196',
                name: 'MASSA MODELAR',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-197',
                name: 'PAPEL BRANCO 40KG',
                category: 'MATERIAL ESCOLAR',
                unit: 'resma',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-198',
                name: 'PAPEL MICRO ONDULADO',
                category: 'MATERIAL ESCOLAR',
                unit: 'rolo',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-199',
                name: 'PAPEL OURO 40K',
                category: 'MATERIAL ESCOLAR',
                unit: 'resma',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-200',
                name: 'PASTA CATÁLOGO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-201',
                name: 'PASTA COM GRAMPO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-202',
                name: 'PASTA LISA TRANSPARENTE',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-203',
                name: 'PASTA PAPELÃO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-204',
                name: 'PASTA USPENSA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-205',
                name: 'PEN DRIVE 16G',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-206',
                name: 'PEN DRIVE 32G',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-207',
                name: 'PENAS COLORIDAS',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-208',
                name: 'PERFURADOR DE PAPEL',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-209',
                name: 'PINCEL 08',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-210',
                name: 'PINCEL 12',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-211',
                name: 'PINCEL 20',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-212',
                name: 'PINCEL PERMANENTE AZUL',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-213',
                name: 'PINCEL PERMANENTE PRETO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-214',
                name: 'PINCEL PERMANENTE VERMELHO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-215',
                name: 'PORTA DOCUMENTOS',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-216',
                name: 'RÉGUA',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-217',
                name: 'TESOURA ESCOLAR',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-218',
                name: 'TESOURA ESCRITÓRIO',
                category: 'MATERIAL ESCOLAR',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-219',
                name: 'TINTA QUADRO AZUL',
                category: 'MATERIAL ESCOLAR',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-220',
                name: 'TINTA QUADRO PRETA',
                category: 'MATERIAL ESCOLAR',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-221',
                name: 'TINTA QUADRO VERMELHA',
                category: 'MATERIAL ESCOLAR',
                unit: 'litro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-222',
                name: 'TNT',
                category: 'MATERIAL ESCOLAR',
                unit: 'metro',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            // GÁS
            {
                id: 'mat-223',
                name: 'P13',
                category: 'GÁS',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            },
            {
                id: 'mat-224',
                name: 'P45',
                category: 'GÁS',
                unit: 'unidade',
                quantity: 0,
                minQuantity: 0,
                unitPrice: 0,
                lastUpdate: new Date().toISOString()
            }
        ];
        return {
            initialSuppliers,
            initialMaterials,
            initialInstitutions
        };
    };
    // Carregar categorias customizadas
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataProvider.useEffect": ()=>{
            const storedCategories = localStorage.getItem('cedim_custom_categories');
            if (storedCategories) {
                try {
                    setCustomCategories(JSON.parse(storedCategories));
                } catch (e) {
                    console.error('Erro ao carregar categorias customizadas:', e);
                }
            } else {
                // Adicionar categorias padrão se não existirem
                const defaultCategories = [
                    'ALIMENTO PERECÍVEL',
                    'ALIMENTO NÃO PERECÍVEL',
                    'LATICÍNIOS',
                    'PROTEÍNAS',
                    'MATERIAL LIMPEZA',
                    'MATERIAL ESCOLAR',
                    'GÁS'
                ];
                setCustomCategories(defaultCategories);
            }
        }
    }["DataProvider.useEffect"], []);
    // Salvar categorias customizadas
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataProvider.useEffect": ()=>{
            if (customCategories.length > 0 || localStorage.getItem('cedim_custom_categories')) {
                localStorage.setItem('cedim_custom_categories', JSON.stringify(customCategories));
            }
        }
    }["DataProvider.useEffect"], [
        customCategories
    ]);
    // Carregar dados do localStorage ou usar dados iniciais
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataProvider.useEffect": ()=>{
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
                        const cleanedSuppliers = data.suppliers.map({
                            "DataProvider.useEffect.cleanedSuppliers": (s)=>{
                                const { email, address, ...rest } = s;
                                // Se não tiver state, tentar inferir da cidade ou usar vazio
                                if (!rest.state) {
                                    rest.state = '';
                                }
                                return rest;
                            }
                        }["DataProvider.useEffect.cleanedSuppliers"]);
                        setSuppliers(cleanedSuppliers);
                    }
                    if (!hasMaterials) {
                        setMaterials(initialMaterials);
                    } else {
                        // Remover description e supplier de materiais antigos (compatibilidade)
                        const cleanedMaterials = data.materials.map({
                            "DataProvider.useEffect.cleanedMaterials": (m)=>{
                                const { description, supplier, ...rest } = m;
                                return rest;
                            }
                        }["DataProvider.useEffect.cleanedMaterials"]);
                        setMaterials(cleanedMaterials);
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
        }
    }["DataProvider.useEffect"], [
        isInitialized
    ]);
    // Salvar dados no localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DataProvider.useEffect": ()=>{
            localStorage.setItem('cedim_data', JSON.stringify({
                suppliers,
                institutions,
                materials,
                requests,
                outputs
            }));
        }
    }["DataProvider.useEffect"], [
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
        // Criar saídas individuais para cada item de cada requisição
        const newOutputs = [];
        const materialQuantityUpdates = {} // materialId -> quantidade total a subtrair
        ;
        newRequests.forEach((request)=>{
            const institution = institutions.find((i)=>i.id === request.institution);
            request.items.forEach((item)=>{
                const material = materials.find((m)=>m.id === item.materialId);
                if (material) {
                    // Acumular quantidade total a subtrair por material
                    if (!materialQuantityUpdates[item.materialId]) {
                        materialQuantityUpdates[item.materialId] = 0;
                    }
                    materialQuantityUpdates[item.materialId] += item.quantity;
                    // Criar saída individual para este item
                    const outputId = Math.random().toString(36).substring(7);
                    newOutputs.push({
                        id: outputId,
                        materialId: item.materialId,
                        materialName: item.materialName,
                        quantity: item.quantity,
                        unit: material.unit,
                        institutionId: request.institution,
                        institutionName: institution?.name,
                        reason: `Requisição ${request.requestNumber}`,
                        responsible: institution?.principalName || 'Sistema',
                        outputDate: request.requiredDate,
                        createdAt: new Date().toISOString()
                    });
                }
            });
        });
        // Adicionar todas as saídas de uma vez
        setOutputs((prev)=>[
                ...prev,
                ...newOutputs
            ]);
        // Atualizar estoque de todos os materiais afetados
        Object.entries(materialQuantityUpdates).forEach(([materialId, totalQuantity])=>{
            const material = materials.find((m)=>m.id === materialId);
            if (material) {
                const newQuantity = Math.max(0, material.quantity - totalQuantity);
                setMaterials((prev)=>prev.map((m)=>m.id === materialId ? {
                            ...m,
                            quantity: newQuantity,
                            lastUpdate: new Date().toISOString()
                        } : m));
            }
        });
    };
    const updateRequest = (id, updates)=>{
        setRequests(requests.map((r)=>r.id === id ? {
                ...r,
                ...updates
            } : r));
    };
    const deleteRequest = (id)=>{
        const request = requests.find((r)=>r.id === id);
        if (!request) return;
        // Encontrar todas as saídas relacionadas a esta requisição
        const relatedOutputs = outputs.filter((o)=>o.reason.includes(request.requestNumber));
        // Calcular quantidades totais a restaurar por material
        const materialQuantityRestores = {} // materialId -> quantidade total a restaurar
        ;
        relatedOutputs.forEach((output)=>{
            if (!materialQuantityRestores[output.materialId]) {
                materialQuantityRestores[output.materialId] = 0;
            }
            materialQuantityRestores[output.materialId] += output.quantity;
        });
        // Restaurar estoque de todos os materiais afetados de uma vez
        Object.entries(materialQuantityRestores).forEach(([materialId, totalQuantity])=>{
            setMaterials((prev)=>prev.map((m)=>m.id === materialId ? {
                        ...m,
                        quantity: m.quantity + totalQuantity,
                        lastUpdate: new Date().toISOString()
                    } : m));
        });
        // Excluir as saídas relacionadas
        const relatedOutputIds = relatedOutputs.map((o)=>o.id);
        setOutputs((prev)=>prev.filter((o)=>!relatedOutputIds.includes(o.id)));
        // Excluir a requisição
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
    const deleteAllOutputs = ()=>{
        // Calcular quantidades totais a restaurar por material
        const materialQuantityRestores = {};
        outputs.forEach((output)=>{
            if (!materialQuantityRestores[output.materialId]) {
                materialQuantityRestores[output.materialId] = 0;
            }
            materialQuantityRestores[output.materialId] += output.quantity;
        });
        // Restaurar estoque de todos os materiais afetados
        Object.entries(materialQuantityRestores).forEach(([materialId, totalQuantity])=>{
            setMaterials((prev)=>prev.map((m)=>m.id === materialId ? {
                        ...m,
                        quantity: m.quantity + totalQuantity,
                        lastUpdate: new Date().toISOString()
                    } : m));
        });
        // Excluir todas as saídas
        setOutputs([]);
    };
    const seedInitialData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DataProvider.useCallback[seedInitialData]": ()=>{
            const { initialSuppliers, initialMaterials, initialInstitutions } = getInitialData();
            // Adicionar apenas se não existirem
            setSuppliers({
                "DataProvider.useCallback[seedInitialData]": (prev)=>{
                    if (prev.length === 0) {
                        return initialSuppliers;
                    }
                    return prev;
                }
            }["DataProvider.useCallback[seedInitialData]"]);
            setMaterials({
                "DataProvider.useCallback[seedInitialData]": (prev)=>{
                    if (prev.length === 0) {
                        return initialMaterials;
                    }
                    return prev;
                }
            }["DataProvider.useCallback[seedInitialData]"]);
            setInstitutions({
                "DataProvider.useCallback[seedInitialData]": (prev)=>{
                    if (prev.length === 0) {
                        return initialInstitutions;
                    }
                    return prev;
                }
            }["DataProvider.useCallback[seedInitialData]"]);
        }
    }["DataProvider.useCallback[seedInitialData]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DataContext.Provider, {
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
            deleteAllOutputs,
            addCustomCategory,
            seedInitialData
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/lib/data-context.tsx",
        lineNumber: 788,
        columnNumber: 5
    }, this);
}
_s(DataProvider, "6h3M+nYzgn/0QVE3PAVwjlMdWEI=");
_c = DataProvider;
function useData() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(DataContext);
    if (!context) {
        throw new Error('useData deve ser usado dentro de DataProvider');
    }
    return context;
}
_s1(useData, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "DataProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/CEDIME/lib/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/lib/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$data$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/lib/data-context.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$data$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataProvider"], {
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
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/CEDIME/hooks/use-toast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
    _s();
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
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
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/CEDIME/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/CEDIME/components/ui/toast.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/@radix-ui/react-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] pointer-events-none', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = ToastViewport;
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full', {
    variants: {
        variant: {
            default: 'border bg-background text-foreground',
            destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground [&_*]:!text-destructive-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
const Toast = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c3 = Toast;
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = ToastAction;
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600', className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
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
_c7 = ToastClose;
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm font-semibold [&]:text-inherit', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = ToastTitle;
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm opacity-90 [&]:text-inherit', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/CEDIME/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = ToastDescription;
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "ToastViewport$React.forwardRef");
__turbopack_context__.k.register(_c1, "ToastViewport");
__turbopack_context__.k.register(_c2, "Toast$React.forwardRef");
__turbopack_context__.k.register(_c3, "Toast");
__turbopack_context__.k.register(_c4, "ToastAction$React.forwardRef");
__turbopack_context__.k.register(_c5, "ToastAction");
__turbopack_context__.k.register(_c6, "ToastClose$React.forwardRef");
__turbopack_context__.k.register(_c7, "ToastClose");
__turbopack_context__.k.register(_c8, "ToastTitle$React.forwardRef");
__turbopack_context__.k.register(_c9, "ToastTitle");
__turbopack_context__.k.register(_c10, "ToastDescription$React.forwardRef");
__turbopack_context__.k.register(_c11, "ToastDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/CEDIME/components/ui/toaster.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/CEDIME/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Toaster() {
    _s();
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, variant, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"], {
                    variant: variant,
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1 flex-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    className: "[&]:text-inherit",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/CEDIME/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    className: "[&]:text-inherit",
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
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
_s(Toaster, "1YTCnXrq2qRowe0H/LBWLjtXoYc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$CEDIME$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = Toaster;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_CEDIME_6dff8640._.js.map