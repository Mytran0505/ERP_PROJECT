import { clearDetails, partListManager, orderBatchListManager, addItemToList, format_date, getActiveBatch, init_web3 } from "./main.js"

window.onload = async function () {

    var x = await init_web3()

    document.getElementById("register-batch").addEventListener("click", function () {
        console.log("Create Batch")
        // 19  

        var lote = document.getElementById("create-lote-number").value
        var batch_weight = document.getElementById("create-batch-type").value

        var creation_date = format_date()
        console.log("Lote: " + lote + " Date:" + creation_date + "Batch Type: " + batch_weight)

        //20 
        var part_sha = web3.utils.soliditySha3(window.accounts[0], web3.utils.fromAscii(lote),
            web3.utils.fromAscii(batch_weight), web3.utils.fromAscii(creation_date))

        window.pm.methods.registerBatch(lote, batch_weight, creation_date).send({ from: window.accounts[0], gas: 1000000 }, function (error, result) {
            console.log("Smart Contract Transaction sent")
            console.log(result)
        })

        console.log(part_sha)

        //21 
        addItemToList(part_sha, "batch-list", partListManager)
    })

    document.getElementById("batch-change-ownership-btn").addEventListener("click", function () {
        console.log("Change Ownership")
        //22 

        var hash_element = getActiveBatch("batch-list")
        if (hash_element != undefined) {
            var to_address = document.getElementById("batch-change-ownership-input").value
            if (to_address != "") {
                window.co.methods.changeOwnership(0, hash_element.textContent, to_address).send({ from: window.accounts[0], gas: 100000 }, function (error, result) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log("Changed ownership")
                        //23 
                        hash_element.parentElement.removeChild(hash_element)
                        clearDetails(document.getElementById("batch-list-details"))
                    }
                })
            }

        }
    })
}