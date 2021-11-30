const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

class LedgerFacade{

    constructor(){
        this.gotCredentials=false
    }

    async getCredentials(){
        // load the network configuration
        const ccpPath = path.resolve(process.cwd(), '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        this.ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        this.wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);
        // Check to see if we've already enrolled the user.
        this.identity = await this.wallet.get('appUser');
        // console.log(`ccp Path: ${ccpPath}`)
        // console.log(this.ccp)
        // console.log(this.wallet)
        // console.log(this.identity)
        this.gotCredentials=true
    }

    async getContract(){
        // Create a new gateway for connecting to our peer node.
        this.gateway = new Gateway();
        var wallet=this.wallet
        var identity=this.identity
        var ccp=this.ccp
        await this.gateway.connect(ccp, {wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await this.gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('miContrato');
        return contract
    }

    async getAllTransactions() {
        try {
            // Comprueba si ya se leyeron las credenciales
            if (!this.gotCredentials){
                await this.getCredentials()
            }

            if (!this.identity) {
                console.log('No se ha podido identificar al usuario');
                return;
            }

            const contract =await this.getContract()

            // Evaluate the specified transaction.
            const result = await contract.evaluateTransaction('queryAllMovimientos');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            // Disconnect from the gateway.
            await this.gateway.disconnect();
            return result

        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    }

    async getTransactionById(id){
        // Comprueba si ya se leyeron las credenciales
        if (!this.gotCredentials){
            await this.getCredentials()
        }

        if (!this.identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            return;
        }

        const contract =await this.getContract()
        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryMovimiento',id);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        // Disconnect from the gateway.
        await this.gateway.disconnect();
        return result
    }

    async createTransaction(id,fecha,monto,autor,referencia,dependencia){
        // Comprueba si ya se leyeron las credenciales
        if (!this.gotCredentials){
            await this.getCredentials()
        }

        if (!this.identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            return;
        }

        const contract = await this.getContract()
        // Evaluate the specified transaction.
        const result = await contract.submitTransaction('createMovimiento',id,fecha,monto,autor,referencia,dependencia);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        // Disconnect from the gateway.
        await this.gateway.disconnect();
        return result
    }

    // Función para cambiar al responsable del registro de la transacción
    async changeResponsable(id,new_reponsable){
        // Comprueba si ya se leyeron las credenciales
        if (!this.gotCredentials){
            await this.getCredentials()
        }

        if (!this.identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            return;
        }

        const contract = await this.getContract()
        // Evaluate the specified transaction.
        const result = await contract.submitTransaction('changeMovimientoResponsable',id,new_reponsable);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        // Disconnect from the gateway.
        await this.gateway.disconnect();
        return result
    }

}
module.exports = LedgerFacade;
