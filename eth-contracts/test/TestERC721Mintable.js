var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: account_one });

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 4, { from: account_one });
            await this.contract.mint(account_one, 5, { from: account_one });
            await this.contract.mint(account_two, 6, { from: account_one });
            await this.contract.mint(account_one, 7, { from: account_one });
            await this.contract.mint(account_two, 8, { from: account_one });
            await this.contract.mint(account_two, 9, { from: account_one });
            await this.contract.mint(account_one, 10, { from: account_one });

        })

        it('should return total supply', async function () {
            let result = await this.contract.totalSupply.call();
            assert.equal(result, 7, "Tokens present not as expected!");
        })

        it('should get token balance', async function () {
            let res = await this.contract.balanceOf.call(account_two, { from: account_two })
            assert.equal(res, 4, "The balance is not the same as expected");
        })

        // // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let res = await this.contract.tokenURI.call(5, { from: account_two })
            assert.equal(
                res,
                "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/5",
                "Token URI is not as expected!"
            );
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(account_two, account_one, 4, {
                from: account_two,
            });

            const res = await this.contract.ownerOf.call(4, { from: account_one })

            assert(res, account_one, 'The address provided is not the owner of the token')
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({ from: account_one });
        })

        it('should fail when minting when address is not contract owner', async function () {
            let error;
            try {
                await this.contract.mint.call(account_two, 13, { from: account_two });
            } catch (err) {
                error = err;
            }

            assert(error, "Function should only be called by the owner")
        })

        it('should return contract owner', async function () {
            let res = await this.contract.getContractOwner.call({ from: account_two })

            assert(res, account_one, "The contract address returned is not the owner")
        })

    });
})