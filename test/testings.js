const ProductManagement = artifacts.require("ProductManagement");
const PorkOwnership = artifacts.require("PorkOwnership");

contract("ProductManagement", accounts => {

    var contract 
    beforeEach(async function() {
        contract = await ProductManagement.new({ from: accounts[0] })
    })

    it("sorry", () =>
        {
            const lote_number = "123456"
            const batch_weight = "3646"
            const creation_date = "04/06/22"
            return contract.registerBatch(lote_number, batch_weight, creation_date, { from: accounts[0] }).then( result => {
                //11 
                p_hash = web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_number),
                web3.utils.fromAscii(batch_weight), web3.utils.fromAscii(creation_date))
                return contract.batches.call(p_hash, { from: accounts[0] }).then(part_info => {
                    // 12
                    assert.equal(part_info["farmer"], accounts[0])
                    assert.equal(part_info["lote_number"], lote_number)
                    assert.equal(part_info["batch_weight"], batch_weight)
                    assert.equal(part_info["creation_date"], creation_date)
                })
            })
        }
    );

    it("Succcess", async () => {
        //13 
        const lote_numbers = ["123456", "123457", "123458", "123459", "123450", "123451"]
        const part_types = ["453", "3454", "2323", "12", "34", "5465"]
        const creation_date = "04/06/22"
        let part_array = []

        let result
        for(let i =0; i< lote_numbers.length; i++){
            result = await contract.registerBatch(lote_numbers[i], part_types[i], creation_date, { from: accounts[0] })
            part_array.push(web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_numbers[i]),
                        web3.utils.fromAscii(part_types[i]), web3.utils.fromAscii(creation_date)))
        }

        //14 
        const lote_prod = "12345678"
        const product_weight = "order"

        result = await contract.registerProduct(lote_prod, product_weight, creation_date, part_array, {from: accounts[0]})
        //15 
        const p_hash = web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_prod),
                                               web3.utils.fromAscii(product_weight), web3.utils.fromAscii(creation_date))
        result = await contract.products.call(p_hash, {from:accounts[0]})
        assert.equal(result["farmer"], accounts[0])
        assert.equal(result["lote_number"], lote_prod)
        assert.equal(result["product_weight"], product_weight)
        assert.equal(result["creation_date"], creation_date)

        //16 
        result = await contract.getBatchs.call(p_hash, {from:accounts[0]})
        for(i = 0; i< part_array.length; i++){
            assert.equal(result[i], part_array[i])
        }
    });

});

contract("PorkOwnership", accounts => {

    var pm
    var contract
    beforeEach(async function() {
        pm = await ProductManagement.new({ from: accounts[0] })
        contract = await PorkOwnership.new(pm.address, { from: accounts[0] })
    })

    it("", async () => {
        const lote_number = "123456"
        const batch_weight = "24"
        const creation_date = "12/12/18"

        result = await pm.registerBatch(lote_number, batch_weight, creation_date, { from: accounts[0] })
        let p_hash = web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_number),
                                             web3.utils.fromAscii(batch_weight), web3.utils.fromAscii(creation_date))
        
        // 0 means batch, 1 means product
        const op_type = 0
        result = await contract.addOwnership(op_type, p_hash)
        result = await contract.currentBatchOwner.call(p_hash)
        assert.equal(result, accounts[0])
    })

    it("", async () => {
        const lote_number = "123456"
        const batch_weight = "3432"
        const creation_date = "04/06/22"

        result = await pm.registerBatch(lote_number, batch_weight, creation_date, { from: accounts[0] })
        let p_hash = web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(lote_number),
                                             web3.utils.fromAscii(batch_weight), web3.utils.fromAscii(creation_date))
        
        // 0 means batch, 1 means product
        const op_type = 0
        result = await contract.addOwnership(op_type, p_hash, { from: accounts[0] })

        result = await contract.changeOwnership(op_type, p_hash, accounts[1], { from: accounts[0] })

        result = await contract.currentBatchOwner.call(p_hash)
        assert.equal(result, accounts[1])
    })
});

