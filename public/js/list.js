/**
 * TASK CONTROLLER
 */
const TaskController = (() => {

    return {

        // Create task
        createTask: async(description) => {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const body = JSON.stringify({
                description,
            })

            const requestOptions = {
                headers: myHeaders,
                method: 'POST',
                body: body,
                redirect: 'follow'
            }

            const res = await fetch('/tasks', requestOptions);

            if (res.status !== 201) {
                return;
            }

            const result = await res.json();
            return result;
        },

        // Read tasks
        readTasks: async() => {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                headers: myHeaders,
                method: 'GET',
                redirect: 'follow'
            }

            const res = await fetch('/tasks', requestOptions)

            if (res.status !== 200) {
                return null
            }
            const result = await res.json()
            return result
        },

        // Delete task
        deleteTask: async(id) => {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                headers: myHeaders,
                method: 'DELETE',
                redirect: 'follow'
            }
            const res = await fetch('/tasks/' + id, requestOptions)

            if (res.status !== 200) {
                return 'error';
            }

            return 'success';

        },

        // Logout
        logout: async() => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json")

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow',
            };

            const res = await fetch("users/logout", requestOptions)
            console.log(res.status);
            if (res.status != 200) {
                return console.log('Can not Logout');
            }

            const result = await res.json()
            console.log("result")
        }
    }
})()

/**
 * USER CONTROLLER
 */

const UserController = (() => {

    return {

        // Logout User
        logout: async() => {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow',
            };

            const res = await fetch("users/logout", requestOptions);
        }
    }
})()

/**
 * UI CONTROLLER
 */
const UIController = (() => {

    const DOMstrings = {
        listTasks: 'task-list',
        inputItem: 'inputItem',
        addBtn: 'addBtn',
        checkbox: 'checkbox',
        message: 'message',
        logoutBtn: 'logoutBtn',
        setting: '.setting'
    }

    return {

        // Get DOMstrings

        getDOMstrings: function() {
            return DOMstrings
        },

        // Remove list tasks
        removeTasks: function() {
            document.getElementById(DOMstrings.listTasks).innerHTML = '';
        },

        // Set list tasks

        setTasks: function(tasks) {

            let html, newHtml, date, time;

            html = '<div class="one-item"><div class="item"><p class="description">%description%</p><input type="checkbox" id="checkbox" value="%_id%" /></div><pre class="time">%time%</pre></div>';


            tasks.forEach((task) => {

                date = new Date(task.createdAt);
                time = date.toLocaleString();

                newHtml = html.replace('%_id%', task._id);
                newHtml = newHtml.replace('%description%', task.description);
                newHtml = newHtml.replace('%time%', time);

                document.getElementById(DOMstrings.listTasks).insertAdjacentHTML('beforeend', newHtml);
            });
        },

        // Get input new task

        getInputTask: function() {

            let description;

            description = document.getElementById(DOMstrings.inputItem).value;
            document.getElementById(DOMstrings.inputItem).value = ''
            return description;
        },

        // Delete task

        deleteTask: function(elTask) {

            setTimeout(() => {
                const listTask = document.getElementById(DOMstrings.listTasks);
                listTask.removeChild(elTask);
            }, 500)

        },

        // Show message

        showMessage: function(type, msg) {

            let el;
            el = document.getElementById(DOMstrings.message)
            el.classList.add('bg-' + type);
            el.innerHTML = msg;

            setTimeout(() => {
                el.classList.remove('bg-' + type);
            }, 1000)
        }
    }
})();

/**
 * APP CONTROLLER
 */

const controller = ((UICtrl, TaskCtrl, UserCtrl) => {

    // Setup Event

    const setupEventListeners = () => {

        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.setting).addEventListener('click', logout);
        document.getElementById(DOM.addBtn).addEventListener('click', addTask);
        document.getElementById(DOM.listTasks).addEventListener('click', deleteTask);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                addTask();
            }
        });
    }

    // Read tasks and set list tasks to UI

    const readTasks = async() => {

        let tasks;

        // Read tasks
        tasks = await TaskCtrl.readTasks();

        if (!tasks) {
            return;
        }
        // Remove list
        UICtrl.removeTasks();

        // Set tasks
        UICtrl.setTasks(tasks);
    }

    // Add a new task

    const addTask = async() => {

        let description, task;

        // Get input task
        description = UICtrl.getInputTask();

        if (description === '') {
            return;
        }
        // Create a new task and save to db
        task = await TaskCtrl.createTask(description);

        if (task == null) {
            location.replace('/login');
        }
        // Add a new task to UI
        UICtrl.setTasks([task]);

        // Show result
        UICtrl.showMessage('success', "Đã Thêm");

    }

    // Delete a task

    const deleteTask = async(e) => {

        // Get task id
        let elTask = e.target.parentNode.parentNode;
        let id = e.target.value;

        if (e.target.id != "checkbox") {
            return;
        }

        // Delete task in database
        const result = await TaskCtrl.deleteTask(id);

        if (result === 'error') {
            location.assign('/login');
        }
        // Delete task in UI
        UICtrl.deleteTask(elTask);

        // Show result
        UICtrl.showMessage('success', 'Đã Xóa')
    }


    // Logout

    const logout = async() => {

        // Remove Jason Web Token
        await UserCtrl.logout();
        location.replace('/');
    }

    return {
        init: () => {
            console.log('List page has started.');
            setupEventListeners();
            readTasks();
        }
    }
})(UIController, TaskController, UserController)

controller.init();