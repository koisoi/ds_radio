import { Track } from "types";

type QueueNode<T> = {
    value: T;
    next?: QueueNode<T>;
};

class Queue<T> {
    protected head: QueueNode<T> | null = null;
    protected tail: QueueNode<T> | null = null;

    /**
     * Accepts head, values of nodes or both. If both provided, nodes based on values of rest parameter will be added to the beginning of the queue.
     * @param head head node of QueueNode<T> type
     * @param values rest parameter of T type
     */
    constructor(head?: QueueNode<T>, ...values: T[]) {
        if (head !== undefined) {
            this.head = head;

            let curNode = head;
            while (curNode.next !== undefined) {
                curNode = curNode.next;
            }
            this.tail = curNode;
        }

        for (const value of values) {
            this.add(value);
        }
    }

    /**
     * Adds value to the beginning of the queue.
     */
    public add(value: T) {
        if (!this.head || !this.tail) {
            this.head = { value };
            this.tail = { value };
        } else {
            const newNode: QueueNode<T> = {
                value,
            };
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    /**
     * Removes and returns value from the end of the queue.
     */
    public pop(): T | null {
        if (!this.head) return null;

        const node = this.head;
        this.head = this.head.next || null;
        return node.value;
    }

    /**
     * Clears the queue
     */
    public clear() {
        this.head = null;
        this.tail = null;
    }
}

export class PlayerQueue extends Queue<Track> {
    /**
     * Accepts head, values of nodes or both. If both provided, nodes based on values of rest parameter will be added to the beginning of the queue.
     * @param head head node of QueueNode<T> type
     * @param values rest parameter of Track type
     */
    constructor(head?: QueueNode<Track>, ...values: Track[]) {
        super(head, ...values);
    }

    /**
     * Returns array of tracks in queue
     */
    public getQueue(): Track[] {
        if (this.head === null) return [];

        const queue = [];
        let node: QueueNode<Track> = this.head;

        while (node.next !== undefined) {
            queue.push(node.value);
            node = node.next;
        }

        return queue;
    }

    /**
     * Inserts the track after the first (playing) one.
     */
    public insertAfterFirst(value: Track) {
        if (!this.head) {
            this.add(value);
            return;
        }

        const newNode = {
            value,
            next: this.head.next,
        };
        this.head.next = newNode;
    }

    /**
     * Removes and returns track from the nth place in the queue
     * @param n place
     */
    public popNth(n: number): Track | null {
        if (!this.head) return null;

        let prevNode: QueueNode<Track> | undefined = this.head;
        let removeNode: QueueNode<Track> | undefined = this.head;
        let nextNode: QueueNode<Track> | undefined = this.head.next;
        for (let i = 0; i < n - 1; i++) {
            prevNode = removeNode;
            removeNode = removeNode?.next;
            nextNode = removeNode?.next;
        }
        if (!prevNode) return null;

        prevNode.next = nextNode;
        return removeNode?.value || null;
    }

    /**
     * Clears the queue except the first track (playing one).
     */
    public clearAllButFirst() {
        if (this.head === null) return;

        this.tail = this.head;
        this.head.next = undefined;
    }
}
