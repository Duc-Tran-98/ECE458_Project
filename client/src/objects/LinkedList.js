import ListNode from './ListNode';

export default class LinkedList {
  constructor(value) {
    this.head = new ListNode(value);
  }

  // TODO: Test me (fix after value)
  insertAfter(prev, value) {
    console.log(`insertinng value: ${value} after ${prev}`);
    let node = this.head;
    while (node) {
      if (node.data === prev) {
        console.log('found value in linked list, inserting after');
        const { next } = node;
        const insert = new ListNode(value);
        console.log('node, insert, next: ');
        console.log(node);
        console.log(insert);
        console.log(next);

        node.next = insert;
        insert.next = next;
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
}
