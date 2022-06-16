(function() {
  'use strict';
  var lastId = 0;
  var taskWrapper = document.getElementById("task_wrapper");
  var btnSave = document.getElementById("save_task");
  var removeIcon;
  var updateIcon;
  var taskList;

  // Initialize taskList 
  // Add event to save button
  // Render the list

  function init() {

    if (!!(window.localStorage.getItem('taskList'))) {
      taskList = JSON.parse(window.localStorage.getItem('taskList'));
    } else {
      taskList = [];
    }
    btnSave.addEventListener('click', saveTask);
    showList();
  }

  //End Init

  //CRUD task

  function showList() {

    if (!!taskList.length) {
      getLastTaskId();
      for (var item in taskList) {
        var task = taskList[item];
        addTaskToList(task);
      }
      syncEvents();
    }
    
  }

  function saveTask(event) {

    var task = {
      taskId: lastId,
      taskDes: document.getElementById("task_des").value,
      taskState: document.getElementById("task_state").value
    };
    taskList.push(task);
    syncTask();
    addTaskToList(task);
    syncEvents();
    lastId++;
  }

  function addTaskToList(task) {

    var removeIcon = document.createElement('span');
    var element = document.createElement('li');
    var updateIcon = document.createElement('span');

    removeIcon.innerHTML = "X";
    removeIcon.className = "remove_item clickeable";
    removeIcon.setAttribute("title", "Remove");

    updateIcon.innerHTML = "U";
    updateIcon.className = "update_icon clickeable";
    updateIcon.setAttribute("title", "Update");


    element.appendChild(removeIcon);
    element.appendChild(updateIcon);
    element.setAttribute("id", task.taskId);
    element.innerHTML += task.taskDes;
    taskWrapper.appendChild(element);
  }

  function updateTask(event) {

    var taskTag = event.currentTarget.parentNode;
    var taskId = taskTag.id;
    var taskToUpdate = findTask(taskId).task;
    var pos = findTask(taskId).pos;
    if (!!taskToUpdate) {
      var des = prompt("Task Description", taskToUpdate.taskDes);
      var state = prompt("Task State", taskToUpdate.taskState);
      taskToUpdate.taskDes = des;
      taskToUpdate.taskState = state;
      taskList[pos] = taskToUpdate;
      taskTag.lastChild.textContent = taskToUpdate.taskDes;
      syncTask();
    }
  }

  function removeTask(event) {

    var taskToRemove = event.currentTarget.parentNode;
    var taskId = taskToRemove.id;
    taskWrapper.removeChild(taskToRemove);
    taskList.forEach(function(value, i) {
      if (value.taskId == taskId) {
        taskList.splice(i, 1);
      }
    })

    syncTask();
  }

  // End CRUD


  //Common

  function syncTask() {

    window.localStorage.setItem('taskList', JSON.stringify(taskList));
    taskList = JSON.parse(window.localStorage.getItem('taskList'));
  }

  function getLastTaskId() {
    var lastTask = taskList[taskList.length - 1];
    lastId = lastTask.taskId + 1;
  }

  function syncEvents() {

    updateIcon = document.getElementsByClassName("update_icon");
    removeIcon = document.getElementsByClassName("remove_item");
    if (!!removeIcon.length) {
      for (var i = 0; i < removeIcon.length; i++) {
        removeIcon[i].addEventListener('click', removeTask);
      }
    }
    if (!!updateIcon.length) {
      for (var j = 0; j < updateIcon.length; j++) {
        updateIcon[j].addEventListener('click', updateTask);
      }
    }
  }

  function findTask(id) {

    var response = {
      task: '',
      pos: 0
    };
    taskList.forEach(function(value, i) {
      if (value.taskId == id) {
        response.task = value;
        response.pos = i;
      }
    });

    return response;
  }

  //End Common


  init();


})();