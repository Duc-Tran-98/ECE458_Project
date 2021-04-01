import ListNode from './ListNode';

export default class LinkedList {
  constructor(value) {
    this.head = new ListNode(value);
  }

  insertAfter(prev, value) {
    let node = this.head;
    while (node) {
      if (node.data === prev) {
        const insert = new ListNode(value);
        insert.next = node.next;
        node.next = insert;
        return;
      }
      node = node.next;
    }
  }

  // TODO: Test me (null pointers, delete last?)
  deleteNode(data) {
    let cur = this.head.next;
    let prev = this.head;
    while (cur) {
      if (cur.data === data) {
        prev.next = cur.next;
        return;
      }
      cur = cur.next;
      prev = prev.next;
    }
  }

  size() {
    let node = this.head;
    let count = 0;
    while (node) {
      count += 1;
      node = node.next;
    }
    return count;
  }
}
