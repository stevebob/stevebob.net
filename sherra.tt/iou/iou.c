#include <stdio.h>
#include <math.h>
#include <malloc.h>


#define TRUE 1
#define FALSE 0

#define CENT 0
#define DOLLAR 1
#define FIVE_CENTS 2
#define FIVE_DOLLARS 3

/**
 * @author Stephen Sherratt
 *
 * This solves the following problem:
 * There are k roommates sharing a house.
 * Over a period of time, they all spend money on communal items.
 * At some point they all decide to pay each other back.
 * They are all logicians, and want to pay each other back in the
 * least possible number of transactions.
 *
 * Who pays what amount to whom?
 */


/**
 * The definition of a payment:
 * There is the index of the person paying.
 * There is the index of the person being payed.
 * There is the amount being payed.
 */
typedef struct payment * Payment;
struct payment {
    int from;
    int to;

    double amount;
};


double * allSums(double * s, int n);
double average(double * s, int n);
void dblSwap(double *s, int a, int b);
void intSwap(int *s, int a, int b);
int part(double * s, int n, double pivot, int * map);
void reduce(double *s, int n, double amount);
int bestPayments(double * owing, double *owed,
                       int nOwing, int nOwed,
                       Payment * payments, 
                       int * map);

double absolute(double x);
double roundOff(Payment * payments, int n, int type);


int main(int argc, char **argv) {

    int n = argc - 1;
    int i;

    double s[n];
    

    for (i=0;i<n;i++) {
        sscanf(argv[i+1], "%lf", &s[i]);   
   //    printf("%2f\n", s[i]);
    }

    
    int map[n];

    double avg = average(s, n);

    int mid = part(s, n, avg, map);
    reduce(s, n, avg);
    
    Payment payments[n];

  //  printf("mid: %d\nAvg: %2f\nList:\n", mid, avg);
  /*  
    for (i=0;i<n;i++) {
        printf("%d: %2f\n", i, s[i]);
    }
*/
    //printf("\n\nbegin:\n");
    

    int m = bestPayments(s, s+mid, mid, n - mid, payments, map);
    
    double error = roundOff(payments, m, CENT);

    for (i=0;i<m;i++) {
        printf("%d -> %d : $%.2lf\n", payments[i]->from, payments[i]->to, payments[i]->amount);
    }
    
    if (error > 0) {
        printf("error: %.2lf\n", error);
    }

/*
    double test[2] = {-1, -1};
    double * testSum = allSums(test, 2);

    for (i = 1;i<4;i++) {
        printf("%2f\n", testSum[i]);
    }
*/
  //  printf("%d\n", 1 & 3); 
    return 0;
}


double absolute(double x) {
    if (x > 0) {
        return x;
    }
    return -x;
}

double roundOff(Payment * payments, int n, int type) {
    
    double error = 0;

    int i;

    double original;
    double tmp;

    if (type == CENT) {
        
        for (i=0;i<n;i++) {
            original = payments[i]->amount;
            tmp = payments[i]->amount * 100;

            double fl = floor(tmp);
            double ce = ceil(tmp);

            if (tmp - fl > ce - tmp) {
                payments[i]->amount = fl / 100;
            } else {
                payments[i]->amount = ce / 100;
            }
            
            error += absolute(payments[i]->amount - original);
        }

    }

    return error;

}


/**
 * Fills an array with the best payments.
 * 
 * IMPORTANT!!!
 * owing must be directly before owed in memory
 * ie. owing[nOwing] == owed[0]
 *
 * @params owing
 *      an array of amounts owing - must be all negative
 *  @params owed
 *      an array of amounts owed - must be all positive
 *  @params nOwing
 *      the number of peope owing
 *  @params nOwed
 *      the number of people owed
 *  @params payments
 *      the array of payments to be populated with best payments
 *      This must have nOwing + nOwed elements declared to
 *      ensure no memory errors.
 *  @params map
 *      an array mappings people's indices to positions in owing
 *  @return
 *      the number of payments
 */
int bestPayments(double * owing, double *owed,
                       int nOwing, int nOwed,
                       Payment * payments, 
                        int * map) {
    //the number of payments
    int nPay = 0;

    int i, j;
    
   /* 
    printf("\nOwing\n%d\n", nOwing);
    for (i=0;i<nOwing;i++) {
        printf("%d: %2f\n", i, owing[i]);
    }
    */

    //make lists of all sums in both lists of amounts
    double * allOwing = allSums(owing, nOwing);
    double * allOwed = allSums(owed, nOwed);

    

    //the sizes of allOwing and allOwed respecively
    int nAllOwing = (int) pow(2, nOwing);
    int nAllOwed = (int) pow(2, nOwed);

/*
    printf("\n\n%d\n", nAllOwing);
    for (i=1;i<nAllOwing;i++) {
        printf("%d: %2f\n", i, allOwing[i]);
    }
    printf("\n");
    printf("%d\n", nAllOwed);
    for (i=1;i<nAllOwed;i++) {
        printf("%d: %2f\n", i, allOwed[i]);
    }
    
    printf("\n\n");
*/
    //this will hold all sums between the two lists
    Payment potential[nAllOwing * nAllOwed];
    int counter = 0;

    //indices start at 1 to follow the convention used in allSums
    for (i = 1;i<nAllOwing;i++) {
        for (j = 1;j<nAllOwed;j++) {
            //printf("%2f\n", absolute(allOwing[i] + allOwed[j]));
            double sum = allOwing[i] + allOwed[j];
            if (sum < 0.001 && sum > -0.001) {
              //  printf(":%d, %d\n", i, j);
                potential[counter] = (Payment) malloc(sizeof(struct payment));
                potential[counter]->from = i;
                potential[counter]->to = j;
                potential[counter]->amount = allOwed[j];
                counter++;
             }
        }
    }

    //we have to make a list of all the amounts to pass to allSums
    double amounts[counter];

    for (i = 0;i<counter;i++) {
        amounts[i] = potential[i]->amount;
     //   printf("%d: %2f\n", i, potential[i]->amount);
    }
    
  //  printf("\n\n");

    double * allComb = allSums(amounts, counter);
    
    int nAllComb = (int) pow(2, counter);
    
    int maxOnes = 0;
    int best = -1;

    //go through every sum of combinations from the zero's we found
    for (i=1;i<nAllComb;i++) {
        //we want the one with the most 1's in the index
        
        if (allComb[i] == potential[counter - 1]->amount) {
         //   printf("%d\n", i);
            int oneCount = 0;

            int tmp = i;

            int seenFrom[nAllOwing];
            int seenTo[nAllOwed];
            
            for (j=0;j<nOwing;j++) {
                seenFrom[j] = FALSE;
            }
            for (j=0;j<nOwed;j++) {
                seenTo[j] = FALSE;
            }

            int doubleUp = FALSE;
            
            
            int k = 0;
            int l;
            j=0;
            //decompose i
            while (tmp > 0 && !doubleUp) {
                
                if (tmp % 2 == 1) {
                        
                    oneCount ++;
                    
                    int f = potential[j]->from;
                    int t = potential[j]->to;
                  //  printf("to: %d   from: %d\n", t, f);

                    for (l=0;l<k && !doubleUp;l++) {
                        if (seenTo[l] & t) {
                            doubleUp = TRUE;
                        }
                        if (seenFrom[l] & f) {
                            doubleUp = TRUE;
                        }
                    }

                    seenTo[k] = t;
                    seenFrom[k] = f;

                    k++;
                }

                tmp /= 2;
                j++;
            }

            if (oneCount > maxOnes && !doubleUp) {
                maxOnes = oneCount;
                best = i;
            }
        }
    }
  //  printf("\n\nbest: %d\n\n\n", best);

/*
    for (i= 0;i<nOwing;i++) {
        printf("%d: %2f\n", i, owing[i]);
    }
    for (i=0;i<nOwed;i++) {
        printf("%d: %2f\n", i+nOwing, owed[i]);
    }

    for (i= 0;i<nOwing +nOwed;i++) {
        printf("map: %d->%d\n", i, map[i]);
    }
    printf("\n\n");
*/
    /*
     * decompose the best index, as this is the sum of indices of
     * transactions we want to use
     */
    i=0;
    while(best > 0) {
       
        if (best % 2 == 1) {
          // printf("%d: %d->%d: %2f\n",i,  potential[i]->from, potential[i]->to, potential[i]->amount);
            

            int to[nOwed];
            int nTo = 0;
        
            int from[nOwing];
            int nFrom = 0;


            int toTmp = potential[i]->to;
            int fromTmp = potential[i]->from;
            //int amount = potential[i]->amount;
            
            j=0;
            while (toTmp > 0) {
                if (toTmp % 2 == 1) {
                    to[nTo] = j;
                    nTo++;
                }
                toTmp /= 2;
                j++;
            }


            j=0;
            while (fromTmp > 0) {
                if (fromTmp % 2 == 1) {
                    from[nFrom] = j;
                    nFrom++;
                }
                fromTmp /= 2;
                j++;
            }
/*
            printf("\t");
            for (j=0;j<nFrom;j++) {
                printf("%d, ", from[j]);
            }
            printf(" -> ");
            for (j=0;j<nTo;j++) {
                printf("%d, ", to[j]);
            }
            printf("\n\n\n");
   */        
            

            /*
             * now that we have smallest subgroups, we can naively
             * solve for each subgroup
             */

            int t = 0;
            int f = 0;
            
        //    printf("to: %d from: %d\n", nTo, nFrom);

            while (t < nTo && f < nFrom) {

                if (-owing[from[f]] < owed[to[t]]) {
                 //   printf("a%d -> %d : %2f\n", from[f], to[t], -owing[from[f]]);
                    
                    payments[nPay] = (Payment) malloc(sizeof(struct payment));
                    payments[nPay]->from = map[from[f]];
                    payments[nPay]->to = map[to[t] + nOwing];
                    payments[nPay]->amount = -owing[from[f]];
                    nPay++;
    
                    owed[to[t]] += owing[from[f]];
                    if (owed[to[t]] == 0) {
                        t++;
                    }
                    f++; 

                } else {
            //        printf("%d -> %d : %2f\n", from[f], to[t], owed[to[t]]);
                 //   printf("nOwed; %d\n", nOwed);

                    payments[nPay] = (Payment) malloc(sizeof(struct payment));
                    payments[nPay]->from = map[from[f]];
                    payments[nPay]->to = map[to[t] + nOwing];
                    payments[nPay]->amount = owed[to[t]];
                    nPay++;
                    
                    owing[from[f]] += owed[to[t]];
                    if (owing[from[f]] == 0) {
                        f++;
                    }
                    t++;
                }
            }
            


        }

        best /= 2;
        
        i++;
    }

    return nPay;
}



/**
 * This reduces every element in an array s of length n by amount
 */
void reduce(double *s, int n, double amount) {
    int i;
    for (i=0;i<n;i++) {
        s[i]-=amount;
    }
}

/**
 * This partitions a list around a pivot and returns the index
 * of the first element to the right of the pivot.
 *
 * @params s
 *      the list to partition
 * @params n
 *      the length of the list
 * @params pivot
 *      the number about which to partition the list
 * @params map
 *      an array of integers with n elements
 */
int part(double * s, int n, double pivot, int * map) {
    int mid = 0;
    int lo = 0;
    int hi = n - 1;
    
    int i;
    for (i=0;i<n;i++) {
        map[i] = i;
    }

    while (hi > lo) {
        if (s[lo] <= pivot) {
            lo++;

        } else {

            dblSwap(s, lo, hi);
            intSwap(map, lo, hi);
            hi--;
            
        }
    }

    if (s[lo] < pivot) {
        mid = lo + 1;
    } else {
        mid = lo;
    }

    return mid;
}

void intSwap(int *s, int a, int b) {
    int tmp = s[a];
    s[a] = s[b];
    s[b] = tmp;
}

/**
 * Swaps elements at a and b in an array s.
 */
void dblSwap(double *s, int a, int b) {
    double tmp = s[a];
    s[a] = s[b];
    s[b] = tmp;
}

/**
 * This returns the average number from a list of doubles.
 *
 * @params s
 *      a list of doubles
 * @params n
 *      the length of the list
 */
double average(double * s, int n) {
    
    //this will hold the total of all numbers in the list
    double total = 0;
    
    //this will hold the average
    double avg;

    int i;
    for (i=0;i<n;i++) {
        total += s[i];
    }

    avg = total / n;

    return avg;
}


/**
 * returns a list containing the sums of all combinations of elements
 * in the array 's'.
 * The length of the list returned will be 2^n+1
 * Indices of elements in the list, when looked at in base 2 have
 * ones in positions corresponding to the elements in the array
 * being added.
 * Note that the 0th element should be ignored.
 *
 * @params s
 *      the array containing elements to sum
 * @params n
 *      the length of the array 's'
 *
 *  @return
 *      an array of integers containing the sum of all combitaniots of
 *      elements
 */
double * allSums(double * s, int n) {
    
    /*
     * the length of the new list
     * It's initialised to 2^n since that is the cardinality of the
     * power set of 's' (if 's' were a set), because each element
     * of 's' is either part of a sum, or not part of a sum (there
     * are 2 possibilities - 'in' or 'out').
     */
    int len = (int) pow(2, n);
    
    //the list of sums we are going to calculate
    double * sumList = (double *) malloc(sizeof(double) * len);
    int final[len];
    //counter
    int i;

    //initialise the sumList to all
    for (i=1;i<len;i++) {
        final[i] = FALSE;
    }

    //put initial values in the list
    for (i=0;i<n;i++) {
        //get powers of 2, so in base 2 they are 1, 10, 100, etc
        int index = (int) pow(2, i);

        sumList[index] = s[i];
        final[index] = TRUE;
    }

    /*
    for (i=1;i<len;i++) {
        printf("%2f\n", sumList[i]);
    }
    */

    //put values in the list
    for (i=1;i<len;i++) {
        //only need to do this if it hasn't been initialised
        if (!final[i]) {
            
            /*
             * We must find the highest power of 2 that is less than
             * the index. This is so it can be subtracted from the
             * index, to obtain a smaller index (for which there
             * must be a value. Also, the power of 2 will have a
             * value (since all powers of 2 were initialised).
             * Then, the element at the power of 2, and the index
             * minus the power of 2 can be added to get the value
             * which should go here.
             */
            int high = 0;
            
            /*
             * This will hold powers of two before they are put in
             * 'high' which means we only need to calculate the
             * power once. It's initialised to 1 as 2^0=1.
             */
            int tmp = 1;

            //the current power of 2
            int currentPower = 0;
            
            while (tmp < i) {
                high = tmp;

                currentPower++;
                tmp = (int) pow(2, currentPower); 
            }

            /*
             * Here, the values of high and i - high correspond to
             * the values in sumList we should add.
             */

            sumList[i] = sumList[high] + sumList[i - high];
            final[i] = TRUE;
        }
    }

    return sumList;
}



    
