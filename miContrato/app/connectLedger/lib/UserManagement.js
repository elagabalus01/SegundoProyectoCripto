const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

// Clase UserManagement
class UserManagement{

    // Constructor de un objeto UserManagement
    constructor() {
    }

    // Función para registrar un usuario
    async registerUser(userid){
        try {
            const ccpPath = path.resolve(process.cwd(), '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

            const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
            const ca = new FabricCAServices(caURL);

            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            const userIdentity = await wallet.get(userid);
            if (userIdentity) {
                console.log(`An identity for the user ${userid} already exists in the wallet`);
                return false;
            }

            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the enrollAdmin.js application before retrying');
                return false;
            }

            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');

            const secret = await ca.register({
                affiliation: 'org1.department1',
                enrollmentID: userid,
                role: 'client'
            }, adminUser);
            const enrollment = await ca.enroll({
                enrollmentID: userid,
                enrollmentSecret: secret
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            await wallet.put(userid, x509Identity);
            console.log(`Successfully registered and enrolled admin user ${userid} and imported it into the wallet`);
            return true
        } catch (error) {
            console.error(`Failed to register user ${userid}: ${error}`);
            throw error
        }
    }
}

module.exports = UserManagement;
