const db = require('./dbconnect');
const limit = 20;
// Get all the lists for a user
const getAllMyLists = function(userId) {
  const query = db.query(
    `SELECT name, description,priority, is_checked
    FROM lists
    Where users.id = $1
    AND is_checked = FALSE
    LIMIT ${limit}
    ORDER BY lists.id DESC
    ;`, [userId])
  .then(res=>{
    return res.rows;
  })
  .catch(err=>{console.log(err)});
  return query;
};

//Get a specific list for a user
const getList = function(userId, listType) {
  const query = db.query(
    `SELECT lists.id, lists.name, description,priority, is_checked
    FROM lists
    WHERE user_id = $1
    AND list_type = $2
    AND is_checked = FALSE
    ORDER BY priority DESC, lists.id
    LIMIT ${limit};`, [userId, listType])
  .then(res=>{
    return res.rows;
  })
  .catch(err=>{console.log(err)});
  return query;
};

//Insert an item to a list
const insertToDoItem = function(property) {
  const query = db.query(
    `INSERT INTO lists(user_id, name, list_type)
    VALUES(1, $1, $2)
    RETURNING *;`, [property.name, property.listType])
  .then(res=>{
    return res.rows;
  })
  .catch(err=>{console.log(err)});
  return query;
};

//update an item to in a list
const updateItem = function(listId, listType, listName, isChecked, priority) {
  let updates = [];
  let params = [];
  if(listType){
    params.push(listType);
    updates.push(`list_type = $${params.length}`)
  }
  if(listName){
    params.push(listName);
    updates.push(`name= $${params.length}`)
  }
  if(isChecked !== undefined){
    params.push(isChecked);
    updates.push(`is_checked = $${params.length}`)
  }
  if(priority !== undefined){
    params.push(priority);
    updates.push(`priority = $${params.length}`)
  }

  params.push(listId);
  const q = `UPDATE  lists
  SET ${updates.join(',')}
  WHERE lists.id = $${params.length}
  RETURNING *;
  `;
  const query = db.query(q , params)
  .then(res=>{
    return res.rows;
  })
  .catch(err=>{console.log(err)});
  return query;
};

const getHistoryList = function(userId) {
    const query = db.query(
      `SELECT id, name, description,priority, is_checked
      FROM lists
      Where user_id = $1
      AND is_checked = TRUE
      ORDER BY lists.id DESC
      LIMIT ${limit}
      ;`, [userId])
    .then(res=>{
      return res.rows;
    })
    .catch(err=>{console.log(err)});
    return query;

};

const getListCount = function(userId) {
  const query = db.query(
    `SELECT COUNT(list_type), list_type
    FROM lists
    WHERE is_checked = false AND user_id = $1
    GROUP BY list_type;`, [userId]
  )
  .then(res=>{
    return res.rows;
  })
  .catch(err=>{console.log(err)});
  return query;
};


exports.getAllMyLists = getAllMyLists;
exports.getList = getList;
exports.insertToDoItem = insertToDoItem;
exports.updateItem = updateItem;
exports.getHistoryList = getHistoryList;
exports.getListCount = getListCount;


