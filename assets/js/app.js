
// Define UI Variables 
const taskInput = document.querySelector('#task'); //the task input text field
const form = document.querySelector('#task-form'); //The form at the top
const filter = document.querySelector('#filter'); //the task filter text field
const taskList = document.querySelector('.collection'); //The UL
const clearBtn = document.querySelector('.clear-tasks'); //the all task clear button

const reloadIcon = document.querySelector('.fa'); //the reload button at the top navigation 

//DB variable 

let DB;
let taskArray = []


// Add Event Listener [on Load]   
document.addEventListener('DOMContentLoaded', () => {
    // create the database
    let TasksDB = indexedDB.open('tasks', 10);

    // if there's an error
    TasksDB.onerror = function() {
            console.log('There was an error');
        }
        // if everything is fine, assign the result to the instance
    TasksDB.onsuccess = function() {
        // console.log('Database Ready');

        // save the result
        DB = TasksDB.result;

        // display the Task List 
        displayTaskList();
    }

    // This method runs once (great for creating the schema)
    TasksDB.onupgradeneeded = function(e) {
        // the event will be the database
        let db = e.target.result;

        // create an object store, 
        // keypath is going to be the Indexes
        let objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

        // createindex: 1) field name 2) keypath 3) options
        objectStore.createIndex('taskname', 'taskname', { unique: false });
        objectStore.createIndex('date', 'date', {unique: false})

        console.log('Database ready and fields created!');
    }

    form.addEventListener('submit', addNewTask);

    function addNewTask(e) {
        e.preventDefault();

        // Check empty entry
        if (taskInput.value === '') {
            taskInput.style.borderColor = "red";

            return;
        }

        // create a new object with the form info
        let newTask = {
            taskname: taskInput.value,
            date: new Date(),
        }

        // Insert the object into the database 
        let transaction = DB.transaction(['tasks'], 'readwrite');
        let objectStore = transaction.objectStore('tasks');

        let request = objectStore.add(newTask);

        // on success
        request.onsuccess = () => {
            form.reset();
        }
        transaction.oncomplete = () => {
            console.log('New appointment added');
            displayTaskList();
        }
        transaction.onerror = () => {
            console.log('There was an error, try again!');
        }

    }

    function displayTaskList() {
        // clear the previous task list
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        // create the object store
        let objectStore = DB.transaction('tasks').objectStore('tasks');

        objectStore.openCursor().onsuccess = function(e) {
            // assign the current cursor
            let cursor = e.target.result;
            if (cursor) {

                // Create an li element when the user adds a task 
                const li = document.createElement('li');
                //add Attribute for delete 
                li.setAttribute('data-task-id', cursor.value.id);
                // Adding a class
                li.className = 'collection-item';
                // Create text node and append it 
                li.appendChild(document.createTextNode(cursor.value.taskname));
                // Create new element for the link 
                const link = document.createElement('a');
                // Add class and the x marker for a 
                link.className = 'delete-item secondary-content';
                link.innerHTML = `
                 <i class="fa fa-remove"></i>
                &nbsp;
                <a href="./edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
                `;
                // Append link to li
                li.appendChild(link);
                // Append to UL 
                taskList.appendChild(li);
                cursor.continue();
            }
        }
    }

    // Remove task event [event delegation]
    taskList.addEventListener('click', removeTask);

    function removeTask(e) {

        if (e.target.parentElement.classList.contains('delete-item')) {
            if (confirm('Are You Sure about that ?')) {
                // get the task id
                let taskID = Number(e.target.parentElement.parentElement.getAttribute('data-task-id'));
                // use a transaction
                let transaction = DB.transaction(['tasks'], 'readwrite');
                let objectStore = transaction.objectStore('tasks');
                objectStore.delete(taskID);

                transaction.oncomplete = () => {
                    e.target.parentElement.parentElement.remove();
                }

            }

        }

    }
    //clear button event listener   
    clearBtn.addEventListener('click', clearAllTasks);

    //clear tasks 
    function clearAllTasks() {
        let transaction = DB.transaction("tasks", "readwrite");
        let tasks = transaction.objectStore("tasks");
        // clear the table.
        tasks.clear();
        displayTaskList();
        console.log("Tasks Cleared !!!");
    }

    // getting the elements to put ascending and descending
    let ascendingBtn = document.querySelector('.ascendingBtn')
    let descendingBtn = document.querySelector('.descendingBtn')
    // adding the listeners
    ascendingBtn.addEventListener('click', ascendingFun)
    descendingBtn.addEventListener('click', descendingFun)

    function ascendingFun(){
        // assignening the variables
       let listElements;
       let continueParsing;
    //    getting the elements from the class collections
       let unorderedLists = document.getElementById("collection");
       //see if the lists are ordered or not
       let ordered = true;
        while (ordered) {
            ordered = false;
            listElements = unorderedLists.getElementsByTagName("LI");
            for (let i = 0; i < (listElements.length - 1); i++) {
                continueParsing = false;
                if (listElements[i].textContent > listElements[i + 1].textContent) {
                    continueParsing = true;
                    break;
                }
            }
            if (continueParsing) {
                listElements[i].parentNode.insertBefore(listElements[i + 1], listElements[i]);
                ordered = true;
            }
        }
    }
    // for the descending functions
    function descendingFun(){
          // assignening the variables
        let listElements;
        let continueParsing;
       //    getting the elements from the class collections
        let unorderedLists = document.getElementById("collection");
          //see if the lists are ordered or not
        unorderedLists = document.getElementById("collection");
        ordered = true;
        while (ordered) {
            ordered = false;
            listElements = unorderedLists.getElementsByTagName("LI");
            for (i = 0; i < (listElements.length - 1); i++) {
                continueParsing = false;
    
                if (listElements[i].textContent < listElements[i + 1].textContent) {
                    continueParsing = true;
                    break;
                }
            }
            if (continueParsing) {
                listElements[i].parentNode.insertBefore(listElements[i + 1], listElements[i]);
                ordered = true;
            }
        }
    }


});




































// // Define UI Variables 
// const taskInput = document.querySelector('#task'); //the task input text field
// const form = document.querySelector('#task-form'); //The form at the top
// const filter = document.querySelector('#filter'); //the task filter text field
// const taskList = document.querySelector('.collection'); //The UL
// const clearBtn = document.querySelector('.clear-tasks'); //the all task clear button

// const reloadIcon = document.querySelector('.fa'); //the reload button at the top navigation 

// //DB variable 

// let DB;
// let taskArray = []


// // Add Event Listener [on Load]   
// document.addEventListener('DOMContentLoaded', () => {
//     // create the database
//     let TasksDB = indexedDB.open('tasks', 3);

//     // if there's an error
//     TasksDB.onerror = function() {
//             console.log('There was an error');
//         }
//         // if everything is fine, assign the result to the instance
//     TasksDB.onsuccess = function() {
//         // console.log('Database Ready');

//         // save the result
//         DB = TasksDB.result;

//         // display the Task List 
//         displayTaskList();
//     }

//     // This method runs once (great for creating the schema)
//     TasksDB.onupgradeneeded = function(e) {
//         // the event will be the database
//         let db = e.target.result;

//         // create an object store, 
//         // keypath is going to be the Indexes
//         let objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

//         // createindex: 1) field name 2) keypath 3) options
//         objectStore.createIndex('taskname', 'taskname', { unique: false });
//         objectStore.createIndex('date', 'date', {unique: false})

//         console.log('Database ready and fields created!');
//     }

//     form.addEventListener('submit', addNewTask);

//     function addNewTask(e) {
//         e.preventDefault();

//         // Check empty entry
//         if (taskInput.value === '') {
//             taskInput.style.borderColor = "red";

//             return;
//         }

//         // create a new object with the form info
//         let newTask = {
//             taskname: taskInput.value,
//             date: new Date(),
//         }

//         // Insert the object into the database 
//         let transaction = DB.transaction(['tasks'], 'readwrite');
//         let objectStore = transaction.objectStore('tasks');

//         let request = objectStore.add(newTask);

//         // on success
//         request.onsuccess = () => {
//             form.reset();
//         }
//         transaction.oncomplete = () => {
//             console.log('New appointment added');
//             displayTaskList();
//         }
//         transaction.onerror = () => {
//             console.log('There was an error, try again!');
//         }

//     }

//     function displayTaskList() {
//         // clear the previous task list
//         while (taskList.firstChild) {
//             taskList.removeChild(taskList.firstChild);
//         }

//         // create the object store
//         let objectStore = DB.transaction('tasks').objectStore('tasks');

//         objectStore.openCursor().onsuccess = function(e) {
//             // assign the current cursor
//             let cursor = e.target.result;
//             if (cursor) {

//                 // Create an li element when the user adds a task 
//                 const li = document.createElement('li');
//                 //add Attribute for delete 
//                 li.setAttribute('data-task-id', cursor.value.id);
//                 // Adding a class
//                 li.className = 'collection-item';
//                 // Create text node and append it 
//                 li.appendChild(document.createTextNode(cursor.value.taskname));
//                 // Create new element for the link 
//                 const link = document.createElement('a');
//                 // Add class and the x marker for a 
//                 link.className = 'delete-item secondary-content';
//                 link.innerHTML = `
//                  <i class="fa fa-remove"></i>
//                 &nbsp;
//                 <a href="./edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
//                 `;
//                 // Append link to li
//                 li.appendChild(link);
//                 // Append to UL 
//                 taskList.appendChild(li);
//                 cursor.continue();
//             }
//         }
//     }

//     // Remove task event [event delegation]
//     taskList.addEventListener('click', removeTask);

//     function removeTask(e) {

//         if (e.target.parentElement.classList.contains('delete-item')) {
//             if (confirm('Are You Sure about that ?')) {
//                 // get the task id
//                 let taskID = Number(e.target.parentElement.parentElement.getAttribute('data-task-id'));
//                 // use a transaction
//                 let transaction = DB.transaction(['tasks'], 'readwrite');
//                 let objectStore = transaction.objectStore('tasks');
//                 objectStore.delete(taskID);

//                 transaction.oncomplete = () => {
//                     e.target.parentElement.parentElement.remove();
//                 }

//             }

//         }

//     }
//     //clear button event listener   
//     clearBtn.addEventListener('click', clearAllTasks);

//     //clear tasks 
//     function clearAllTasks() {
//         let transaction = DB.transaction("tasks", "readwrite");
//         let tasks = transaction.objectStore("tasks");
//         // clear the table.
//         tasks.clear();
//         displayTaskList();
//         console.log("Tasks Cleared !!!");
//     }


// });

// // sorting in ascending order
// let ascendingBtn = document.querySelector('.ascendingBtn')
// let descendingBtn = document.querySelector('.descendingBtn')

// ascendingBtn.addEventListener('click', ascendingFun)
// descendingBtn.addEventListener('click', descendingFun)


// // function ascendingFun(){
// //     let i = 0;
// //     let transaction = DB.transaction("tasks");
// //     let store = transaction.objectStore("tasks");
// //     let req = store.openCursor();
// //     req.onsuccess = e=>{
// //         let cursor = e.target.result
// //         if(cursor){
// //             taskArray[i] = cursor.value
// //             i++
// //             cursor.continue();
// //         }
// //      taskArray.sort(function(a,b){return a.taskname - b.taskname})
// //      taskList.innerHTML = ""
// //      var i = 0
// //      for (i = 0; i<taskArray.length; i++){
// //          const li = createElement('LI')
// //          li.className = 'collection-item'
// //          li.setAttribute('data-task-id', taskArray[i].id)
// //          li.appendChild(document.createTextNode(taskArray[i].taskname))
// //          const link = document.createElement('a')
// //          link.className('delete-item secondary-content')
// //          link.innerHTML = '<i class="fa fa-remove"></i>  &nbsp;<a href="../edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a> ;';
// //          li.appendChild(link);                                                       // Append link to li
// //          taskList.appendChild(li); 
// //      }
// //     }
    
// // }

// function ascendingFun(){
//      let container = taskList;
//      container.innerHTML = ""
//      let tx = DB.transaction('tasks').objectStore('tasks')
//      let allRecords = tx.getAll();
//      allRecords.onsuccess = ()=>{
//          const taskNames = allRecords.result.map((allRecord)=>({
//             taskname: allRecord.taskname,
//             taskdate: allRecord.date
//          }))

//          taskNames.sort((a,b)=>{
//              let aa = a.taskdate
//              let bb = b.taskdate
//              return aa>bb ?-1: (aa<bb ? 1:0);
//          }).forEach((li,index)=>{
//              li = document.createElement('li');
//              li.setAttribute('data-task-id', index + 1);
//              li.className = 'collection-item';
//              li.appendChild(document.createTextNode(li.taskname));
//              const link = document.createElement('a');
//              link.className = 'delete-item secondary-content';
//              link.innerHTML = `
//               <i class="fa fa-remove"></i>
//              &nbsp;
//              <a href="./edit.html?id=${index + 1}"><i class="fa fa-edit"></i> </a>
//              `;
//              li.appendChild(link);
//              container.appendChild(li);
//          })
//      }
// }
// function descendingFun(){
//     let container = taskList;
//     container.innerHTML = ""
//     let tx = DB.transaction('tasks').objectStore('tasks')
//     let allRecords = tx.getAll();
//     allRecords.onsuccess = ()=>{
//         const taskNames = allRecords.result.map((allRecord)=>({
//            taskname: allRecord.taskname,
//            date: allRecord.date
//         }))

//         taskNames.sort((a,b)=>{
//             let aa = a.date
//             let bb = b.date
//             return aa<bb ?-1: (aa>bb ? 1:0);
//         }).forEach((li,index)=>{
//             li = document.createElement('li');
//             li.setAttribute('data-task-id', index + 1);
//             li.className = 'collection-item';
//             li.appendChild(document.createTextNode(li.taskname));
//             const link = document.createElement('a');
//             link.className = 'delete-item secondary-content';
//             link.innerHTML = `
//              <i class="fa fa-remove"></i>
//             &nbsp;
//             <a href="./edit.html?id=${index+1}"><i class="fa fa-edit"></i> </a>
//             `;
//             li.appendChild(link);
//             container.appendChild(li);
//         })
//     }
// }

// function ascne() {
//     const unorderedList = document.querySelectorAll(".collection-item");
//     var orderingArray = new Array();
//     const currentTime = Date.now();
//     for (let i = 0; i < unorderedList.length; i++) {
//       listItem = unorderedList[i].querySelector(".dateDiv");
//       taskListTime = listItem.textContent;
//       let differenceTime = currentTime - taskListTime;
//       orderingArray[i] = [differenceTime, i];
//     }
//     orderingArray.sort();
//     orderingArray.reverse();
//     for (let i = 0; i < unorderedList.length; i++) {
//       collectionSorted.appendChild(unorderedList[orderingArray[i][1]]);
//     }
//     for (let i = 0; i < unorderedList.length; i++) {
//       taskList.appendChild(unorderedList[orderingArray[i][1]]);
//     }
//   }

