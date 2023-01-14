import { orderListManager, addItemToList, format_date, init_web3, orderBatchListManager, getMultipleActiveBatch, getActiveBatch, clearOrderDetails, getOwnerHistoryFromEvents, getOwnedItemsFromEvent } from "./main.js"



window.onload = async function () {

    var x = await init_web3()
    //41 
    var batches = await getOwnedItemsFromEvent(window.accounts[0], 'TransferBatchOwnership')
    console.log(batches)
    for (var i = 0; i < batches.length; i++) {
        var owners = await getOwnerHistoryFromEvents('TransferBatchOwnership', batches[i])
        console.log(owners)
        if (owners[owners.length - 1] == window.accounts[0]) {
            addItemToList(batches[i], "order-batch-list", orderBatchListManager)
        }
    }

    document.getElementById("register-order").addEventListener("click", function () {
        console.log("Register Order")

        //42 
        var lote = document.getElementById("create-order-lote-number").value
        if (lote != "") {
            //43 
            var part_list = getMultipleActiveBatch()
            var part_array = []
            for (var i = 0; i < part_list.length; i++) {
                part_array.push(part_list[i].textContent)
            }

            var creation_date = format_date()

            console.log("Create order with params")
            console.log(lote)
            console.log(part_array)
            console.log(creation_date)
            //44
            window.pm.methods.registerProduct(lote, "Order", creation_date, part_array).send({ from: window.accounts[0], gas: 2000000 }, function (error, result) {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Order created")
                    // 45
                    var order_sha = web3.utils.soliditySha3(window.accounts[0], web3.utils.fromAscii(lote),
                        web3.utils.fromAscii("Order"), web3.utils.fromAscii(creation_date))
                    addItemToList(order_sha, "order-list", orderListManager)

                    //46 
                    for (var i = 0; i < part_list.length; i++) {
                        part_list[i].removeEventListener("click", orderBatchListManager)
                        part_list[i].parentElement.removeChild(part_list[i])
                    }
                }
            })
        }
    })

    document.getElementById("order-change-ownership-btn").addEventListener("click", function () {
        console.log("Change Ownership")
        //47 

        var hash_element = getActiveBatch("order-list")
        if (hash_element != undefined) {
            var to_address = document.getElementById("order-change-ownership-input").value
            if (to_address != "") {
                window.co.methods.changeOwnership(1, hash_element.textContent, to_address).send({ from: window.accounts[0], gas: 100000 }, function (error, result) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log("Changed ownership")
                        //48 
                        hash_element.parentElement.removeChild(hash_element)
                        clearOrderDetails()
                    }
                })
            }

        }
    })
}