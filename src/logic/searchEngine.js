/**
 * Función principal para buscar troqueles de acuerdo a las reglas de negocio.
 * 
 * @param {Array} baseDeDatosTroqueles - Arreglo con datos desde Firestore
 * @param {Object} input - Parámetros de búsqueda
 * @returns {Array} Resultados ordenados
 */
export function buscarTroquel(baseDeDatosTroqueles, input) {
    const {
        ancho,
        largo,
        tolerancia = 0,
        forma,
        esquinas,
        precorte_integrado,
        precorte
    } = input;

    const resultados = baseDeDatosTroqueles.filter((troquel) => {
        // 1. Filtros exactos (100% de coincidencia) si fueron proveídos
        if (forma && forma !== "Variada" && troquel.forma !== forma) return false;
        if (esquinas && esquinas !== "N/A" && troquel.esquinas !== esquinas) return false;
        // 1. Filtros de Precorte Integrado y Precorte entre Cavidades
        // Regla para Precorte Integrado:
        // Si el troquel tiene precorte integrado ("SI"), de ninguna manera debe proponerse si la casilla no está en "SI".
        // Si la casilla está en "SI", el troquel debe tener precorte integrado.
        const isSearchPrecorteIntegrado = precorte_integrado === 'SI';
        const isTroquelPrecorteIntegrado = troquel.precorte_integrado === 'SI';
        if (isTroquelPrecorteIntegrado !== isSearchPrecorteIntegrado) return false;

        // Regla para Precorte entre Cavidades:
        // Si el usuario busca con precorte ("SI"), el troquel debe tener precorte.
        // Si busca sin precorte ("NO"), no se filtra (puede proponer con y sin precorte).
        if (precorte === 'SI') {
            const hasPrecorte = troquel.precorte_entre_cavidades && (
                troquel.precorte_entre_cavidades === 'SI' ||
                troquel.precorte_entre_cavidades.includes('SI') ||
                troquel.precorte_entre_cavidades.includes('+PREC')
            );
            if (!hasPrecorte) return false;
        }

        // 2. Tolerancia dimensional con orientación fija (Intocable)
        // Comparar Ancho con Ancho_mm exclusivamente
        if (typeof ancho === 'number') {
            if (troquel.ancho_mm < (ancho - tolerancia) || troquel.ancho_mm > (ancho + tolerancia)) {
                return false;
            }
        }

        // Comparar Largo con Largo_mm exclusivamente
        if (typeof largo === 'number') {
            if (troquel.largo_mm < (largo - tolerancia) || troquel.largo_mm > (largo + tolerancia)) {
                return false;
            }
        }

        return true; // Pasa todos los filtros
    });

    // 3. Prioridad de Resultados: "TROQUELES FLEXIBLES CUADRADOS Y RECTANGULARES" primero
    resultados.sort((a, b) => {
        const familiaFoco = "TROQUELES FLEXIBLES CUADRADOS Y RECTANGULARES";
        const aEsFoco = a.familia_troquel === familiaFoco;
        const bEsFoco = b.familia_troquel === familiaFoco;

        if (aEsFoco && !bEsFoco) return -1;
        if (!aEsFoco && bEsFoco) return 1;

        return 0;
    });

    return resultados;
}

