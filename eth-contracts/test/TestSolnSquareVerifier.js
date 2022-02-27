var SolnSquareVerifier = artifacts.require("SolnSquareVerifier")
var verifierContract = artifacts.require("Verifier")

const proofFromFile = require("../../zokrates/code/square/proof.json");

const getProofAsUint = (proofCheck) => {
    return {
        "proof": {
            "a": [web3.utils.toBN(proofCheck.proof.a[0]).toString(), web3.utils.toBN(proofCheck.proof.a[1]).toString()],
            "b": [[web3.utils.toBN(proofCheck.proof.b[0][0]).toString(), web3.utils.toBN(proofCheck.proof.b[0][1]).toString()],
            [web3.utils.toBN(proofCheck.proof.b[1][0]).toString(), web3.utils.toBN(proofCheck.proof.b[1][1]).toString()]
            ],
            "c": [web3.utils.toBN(proofCheck.proof.c[0]).toString(), web3.utils.toBN(proofCheck.proof.c[1]).toString()],
        },
        "inputs": proofCheck.inputs
    };
};

contract("TestSolnSquareVerifier", (accounts) => {

    const account_one = accounts[0]

    describe("Check if the solutions can be added", () => {
        beforeEach(async () => {
            this.Verifier = await verifierContract.new({ from: account_one });
            this.SolnSquareVerifier = await SolnSquareVerifier.new(this.Verifier.address, { from: account_one })
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it("test if a new solution can be added for contract", async () => {
            const proofCheck = getProofAsUint(proofFromFile)

            await this.SolnSquareVerifier.addSolution.call(
                index = 1,
                account_one,
                proofCheck.proof.a,
                proofCheck.proof.b,
                proofCheck.proof.c,
                proofCheck.inputs,
                { from: account_one }
            );

            const countSolutions = await this.SolnSquareVerifier.getSolutionCount.call({ from: account_one });
            
            assert(countSolutions, 1, 'The solution has not been added');
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it(" test if an ERC721 token can be minted", async () => {
            const proofCheck = getProofAsUint(proofFromFile)

            let res = await this.SolnSquareVerifier.mintToken.call(
                proofCheck.proof.a,
                proofCheck.proof.b,
                proofCheck.proof.c,
                proofCheck.inputs,
                ID = 4,
                { from: account_one }
            )

            assert.equal(res, true, 'The token was not minted')
        })
    })





    
})


