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
                referencia: 'Servicio 1',
                monto: 10,
                fecha: '19-12-20 01:00',
                responsable: 'Usuario 1',
                dependencia: 'salud'
            },
            {
                referencia: 'Servicio 2',
                monto: 1000,
                fecha: '09-12-20 10:00',
                responsable: 'Usuario 2',
                dependencia: 'obras'
            },
            {
                referencia: 'Servicio 3',
                monto: 100,
                fecha: '20-12-20 03:00',
                responsable: 'Usuario 3',
                dependencia: 'gobernación'
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

    async createMovimiento(ctx, movNumber, fecha, monto, responsable,referencia,dependencia) {
        console.info('============= START : Create movement ===========');

        const movimiento = {
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
