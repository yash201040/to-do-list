// Initialize

let taskItemList = [];

if (localStorage.key(1) === null) {
  localStorage.setItem("taskDataList", "[]");
  localStorage.setItem("timeDataList", "[]");
}

const initialize = () => {
  populatePage();
  const addBtn = document.getElementById("addBtn");
  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", () => resetAll());
  addBtn.addEventListener("click", () => addListItem());
};

const populatePage = () => {
  if (localStorage.taskDataList === "" || localStorage.timeDataList === "") return;
  const taskDataList = JSON.parse(localStorage.taskDataList);
  const timeDataList = JSON.parse(localStorage.timeDataList);
  const len = timeDataList.length;
  for (let i = 0; i < len; i++) {
    const timestamp = timeDataList[i];
    const taskData = taskDataList[i];
    createListItem(timestamp);
    taskItemList[i].taskData = taskData;
    document.getElementById("taskData" + timestamp).innerHTML = taskData;
  }
};

window.onload = initialize;

// Create Add

const addListItem = () => {
  const today = new Date();
  const timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  createListItem(timestamp);
  const taskItem = taskItemList[taskItemList.length - 1];
  const updateTaskCallback = () => updateTask(taskItem);
  taskItem.updateTaskCallback = updateTaskCallback;
  showInputBox(taskItem);
};

const createListItem = (timestamp) => {
  const listItem = document.createElement("DIV");
  listItem.setAttribute("class", "listItem");
  listItem.setAttribute("id", "li" + timestamp);
  const listContainer = document.getElementById("listContainer");
  listContainer.appendChild(listItem);
  const taskContainer = createTaskContainer(timestamp);
  listItem.appendChild(taskContainer);
  const optionsContainer = createOptionsContainer(listItem);
  listItem.appendChild(optionsContainer);
};

// Task Container Creation

const createTaskContainer = (timestamp) => {
  createTaskContainerDS(timestamp);
  const taskContainer = createTaskContainerUI(timestamp);
  return taskContainer;
};

const createTaskContainerDS = (timestamp) => {
  const taskItem = {
    taskData: "",
    timeData: timestamp,
    showOptionsCallback: 0,
    hideOptionsCallback: 0,
    editFunctionCallback: 0,
    delFunctionCallback: 0,
  };
  taskItemList.push(taskItem);
  return taskItem;
};

const createTaskContainerUI = (timestamp) => {
  const taskContainer = document.createElement("DIV");
  taskContainer.setAttribute("class", "taskContainer");
  const taskData = document.createElement("DIV");
  taskData.setAttribute("class", "taskData yScroller");
  const id = "taskData" + timestamp;
  taskData.setAttribute("id", id);
  const timeData = document.createElement("DIV");
  timeData.setAttribute("class", "timeData");
  timeData.innerHTML = timestamp;
  taskContainer.appendChild(taskData);
  taskContainer.appendChild(timeData);
  return taskContainer;
};

// Options Container Creation

const createOptionsContainer = (listItem) => {
  const optionsContainer = document.createElement("DIV");
  optionsContainer.setAttribute("class", "optionsContainer");
  createItemHoverLogic(listItem, optionsContainer);
  createOptions(listItem, optionsContainer);
  return optionsContainer;
};

const createItemHoverLogic = (listItem, optionsContainer) => {
  const showOptionsCallback = () => showOptions(optionsContainer);
  const hideOptionsCallback = () => hideOptions(optionsContainer);
  const taskItem = taskItemList[taskItemList.length - 1];
  taskItem.showOptionsCallback = showOptionsCallback;
  taskItem.hideOptionsCallback = hideOptionsCallback;
  listItem.addEventListener("mouseover", showOptionsCallback);
  listItem.addEventListener("mouseleave", hideOptionsCallback);
};

const showOptions = (optionsContainer) => (optionsContainer.style.display = "flex");
const hideOptions = (optionsContainer) => (optionsContainer.style.display = "none");

const createOptions = (listItem, optionsContainer) => {
  const editBtn = createEditBtn();
  const delBtn = createDelBtn(listItem);
  optionsContainer.appendChild(editBtn);
  optionsContainer.appendChild(delBtn);
};

// Create Edit

const createEditBtn = () => {
  const editBtn = document.createElement("BUTTON");
  editBtn.setAttribute("class", "btn taskOptions editBtn");
  const taskItem = taskItemList[taskItemList.length - 1];
  const editFunctionCallback = () => editFunction(taskItem);
  taskItem.editFunctionCallback = editFunctionCallback;
  editBtn.addEventListener("click", editFunctionCallback);
  editBtn.innerHTML = `<i class="fas fa-pencil-alt"></i>`;
  return editBtn;
};

const editFunction = (taskItem) => {
  const updateTaskCallback = () => updateTask(taskItem);
  taskItem.updateTaskCallback = updateTaskCallback;
  showInputBox(taskItem);
};

// Switch Input box display

const showInputBox = (taskItem) => {
  const inputContainer = document.getElementById("inputContainer");
  const inputTask = document.getElementById("inputTask");
  const confirmBtn = document.getElementById("confirmBtn");
  const { taskData, updateTaskCallback } = taskItem;
  const updateWithEnterCallback = (keyboardEvent) => {
    if (keyboardEvent.key === "Enter") updateTask(taskItem);
    else return;
  };
  taskItem.updateWithEnterCallback = updateWithEnterCallback;
  inputContainer.style.display = "flex";
  inputTask.value = taskData;
  inputTask.focus();
  inputTask.addEventListener("keypress", updateWithEnterCallback);
  confirmBtn.addEventListener("click", updateTaskCallback);
  disableOtherButtons();
};

const hideInputBox = () => {
  const inputContainer = document.getElementById("inputContainer");
  inputContainer.style.display = "none";
  enableOtherButtons();
  updateLocalStorage();
};

// Switch Buttons On/Off

const enableOtherButtons = () => {
  document.getElementById("addBtn").disabled = false;
  document.getElementById("resetBtn").disabled = false;
  enableAllOptions();
};

const disableOtherButtons = () => {
  document.getElementById("addBtn").disabled = true;
  document.getElementById("resetBtn").disabled = true;
  disableAllOptions();
};

const enableAllOptions = () => {
  const editBtnList = document.getElementsByClassName("editBtn");
  const delBtnList = document.getElementsByClassName("delBtn");
  for (const editBtn of editBtnList) editBtn.disabled = false;
  for (const delBtn of delBtnList) delBtn.disabled = false;
};

const disableAllOptions = () => {
  const editBtnList = document.getElementsByClassName("editBtn");
  const delBtnList = document.getElementsByClassName("delBtn");
  for (const editBtn of editBtnList) editBtn.disabled = true;
  for (const delBtn of delBtnList) delBtn.disabled = true;
};

// Update task - (used by Edit & Add)

const updateTask = (taskItem, timestamp = getLiveTime()) => {
  const { timeData, updateTaskCallback, updateWithEnterCallback } = taskItem;
  const id = "taskData" + timeData;
  const taskData = document.getElementById(id);
  const listItem = taskData.parentElement.parentElement;
  const inputTask = document.getElementById("inputTask");
  taskItem.taskData = inputTask.value;
  taskItem.timeData = timestamp;
  updateLocalStorage();
  taskData.innerHTML = inputTask.value;
  inputTask.value = "";
  taskData.setAttribute("id", "taskData" + timestamp);
  listItem.setAttribute("id", "li" + timestamp);
  taskData.nextElementSibling.innerHTML = timestamp;
  inputTask.removeEventListener("keypress", updateWithEnterCallback);
  confirmBtn.removeEventListener("click", updateTaskCallback);
  hideInputBox();
};

const getLiveTime = () => {
  const today = new Date();
  const timestamp = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return timestamp;
};

// Update local storage - (used by Update task & Delete)

const updateLocalStorage = () => {
  const taskDataList = [];
  const timeDataList = [];
  for (obj of taskItemList) {
    taskDataList.push(obj.taskData);
    timeDataList.push(obj.timeData);
  }
  localStorage.clear();
  localStorage.setItem("taskDataList", JSON.stringify(taskDataList));
  localStorage.setItem("timeDataList", JSON.stringify(timeDataList));
};

// Create Delete

const createDelBtn = (listItem) => {
  const delBtn = document.createElement("BUTTON");
  delBtn.setAttribute("class", "btn taskOptions delBtn");
  const taskItem = taskItemList[taskItemList.length - 1];
  const delFunctionCallback = () => delFunction(taskItem, listItem);
  taskItem.delFunctionCallback = delFunctionCallback;
  delBtn.addEventListener("click", delFunctionCallback);
  delBtn.innerHTML = `<i class="fas fa-trash"></i>`;
  return delBtn;
};

const delFunction = (taskItem, listItem) => {
  removeAllEventListeners(taskItem, listItem);
  const index = taskItemList.findIndex((item) => {
    if (taskItem === item) return true;
  });
  taskItemList.splice(index, 1);
  listItem.remove();
  updateLocalStorage();
};

const removeAllEventListeners = (taskItem, listItem) => {
  const { showOptionsCallback, hideOptionsCallback, editFunctionCallback, delFunctionCallback } = taskItem;
  const [editBtn, delBtn] = listItem.children[1].children;
  listItem.removeEventListener("mouseover", showOptionsCallback);
  listItem.removeEventListener("mouseleave", hideOptionsCallback);
  editBtn.removeEventListener("click", editFunctionCallback);
  delBtn.removeEventListener("click", delFunctionCallback);
};

const resetAll = () => {
  const listItems = document.getElementsByClassName("listItem");
  if (listItems.length === 0) return;
  Array.from(listItems).forEach((element) => element.remove());
  taskItemList = [];
  localStorage.clear();
  localStorage.setItem("taskDataList", "[]");
  localStorage.setItem("timeDataList", "[]");
};
