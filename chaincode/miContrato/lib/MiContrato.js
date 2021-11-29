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
                fecha: '19-12-20',
                owner: 'Tomoko',
            },
            {
                referencia: 'Servicio 2',
                monto: 1000,
                fecha: '19-12-20',
                owner: 'Tomoko',
            },
            {
                referencia: 'Servicio 3',
                monto: 100,
                fecha: '20-12-20',
                owner: 'Komoto',
            }
        ];

        for (let i = 0; i < movimientos.length; i++) {
            movimientos[i].docType = 'movimiento';
            await ctx.stub.putState('movimiento' + i, Buffer.from(JSON.stringify(movimientos[i])));
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

    async createMovimiento(ctx, movNumber, fecha, monto, owner,referencia) {
        console.info('============= START : Create Car ===========');

        const movimiento = {
            referencia,
            docType: 'movimiento',
            monto,
            fecha,
            owner,
        };

        await ctx.stub.putState(movNumber, Buffer.from(JSON.stringify(movimiento)));
        console.info('============= END : Create Car ===========');
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

    async changeMovimientoOwner(ctx, movNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const movAsBytes = await ctx.stub.getState(movNumber); // get the car from chaincode state
        if (!movAsBytes || movAsBytes.length === 0) {
            throw new Error(`${movNumber} does not exist`);
        }
        const mov = JSON.parse(movAsBytes.toString());
        mov.owner = newOwner;

        await ctx.stub.putState(movNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = MiContrato;
