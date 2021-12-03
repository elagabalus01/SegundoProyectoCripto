/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class MiContrato extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const movimientos = [
            {
                userid: 'admin',
                referencia: 'Reforestación con semillas de bambú',
                monto: -2000,
                fecha: '1 de diciembre del 2021 a las 17:17 hrs',
                responsable: 'Usuario 1',
                dependencia: 'Secretaría del Medio Ambiente'
            },
            {
                userid: 'admin',
                referencia: 'Compra de mangueras',
                monto: -1000,
                fecha: '2 de diciembre del 2021 a las 17:17 hrs',
                responsable: 'Usuario 2',
                dependencia: 'Secretaria de Protección Civil y Gestión Integral de Riesgos'
            },
            {
                userid: 'admin',
                referencia: 'Retribución por ayuda del ciudadano en cámaras de seguridad',
                monto: 6000,
                fecha: '4 de diciembre del 2021 a las 17:17 hrs',
                responsable: 'Usuario 3',
                dependencia: 'Secretaría de Seguridad Ciudadana'
            }
        ];

        for (let i = 0; i < movimientos.length; i++) {
            movimientos[i].docType = 'movimiento';
            await ctx.stub.putState('mov' + i, Buffer.from(JSON.stringify(movimientos[i])));
            console.info('Added <--> ', movimientos[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryMovimiento(ctx, movNumber) {
        const movAsBytes = await ctx.stub.getState(movNumber); // get the car from chaincode state
        if (!movAsBytes || movAsBytes.length === 0) {
            throw new Error(`${movNumber} does not exist`);
        }
        console.log(movAsBytes.toString());
        return movAsBytes.toString();
    }

    async createMovimiento(ctx, movNumber, userid, fecha, monto, responsable,referencia,dependencia) {
        console.info('============= START : Create movement ===========');

        const movimiento = {
            userid,
            referencia,
            docType: 'movimiento',
            monto,
            fecha,
            responsable,
            dependencia,
        };

        await ctx.stub.putState(movNumber, Buffer.from(JSON.stringify(movimiento)));
        console.info('============= END : Create movement ===========');
    }

    async queryAllMovimientos(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeMovimientoResponsable(ctx, movNumber, newresponsable) {
        console.info('============= START : change responsable ===========');

        const movAsBytes = await ctx.stub.getState(movNumber); // get the car from chaincode state
        if (!movAsBytes || movAsBytes.length === 0) {
            throw new Error(`${movNumber} does not exist`);
        }
        const mov = JSON.parse(movAsBytes.toString());
        mov.responsable = newresponsable;

        await ctx.stub.putState(movNumber, Buffer.from(JSON.stringify(mov)));
        console.info('============= END : change responsable ===========');
    }
}

module.exports = MiContrato;
