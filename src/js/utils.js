class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

export class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.current = null;
        this.size = 0;
    }
    add(key, value) {
        const newNode = new Node(key, value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
        this.current = newNode;
        this.size++;
    }

    goForward() {
        if (this.current && this.current.next) {
            this.current = this.current.next;
            return this.current;
        }
        console.warn("LinkedList head");
        return null;
    }

    goBack() {
        if (this.current && this.current.prev) {
            this.current = this.current.prev;
            return this.current;
        }
        console.warn("LinkedList tail");
        return null;
    }

    get(key) {
        let current = this.head;
        
        while (current) {
            if (current.key === key) {
                return current;
            }
            current = current.next;
        }
        
        console.warn(`Fail to get Node "${key}"`);
        return null;
    }

    getValue(key) {
        const node = this.get(key);
        return node ? node.value : null;
    }

    getCurrentData() {
        return this.current ? { key: this.current.key, value: this.current.value } : null;
    }
}