import pigpio
import threading
from time import sleep
import logging

from rotary_encoder.motorencoder import MotorEncoder

class WheelsAxel:
    """ Class that handles both motor encoders, left and right

        This class works like a wheels axle, coordinating left and right
        wheels at the same time

        It also tries to handle the inconsistent tension on wheels
        that makes one wheel go slower than the other """

    def __init__(self, pi, enable_pin,
                 left_forward_pin, left_backward_pin, left_encoder_feedback_pin_A, left_encoder_feedback_pin_B,
                 right_forward_pin, right_backward_pin, right_encoder_feedback_pin_A, right_encoder_feedback_pin_B):

        # state variables
        self._is_moving = False

        # left motor
        self._left_motor = MotorEncoder(pi,
                                        enable_pin,
                                        left_forward_pin,
                                        left_backward_pin,
                                        left_encoder_feedback_pin_A,
                                        left_encoder_feedback_pin_B)
        # right motor
        self._right_motor = MotorEncoder(pi,
                                         enable_pin,
                                         right_backward_pin,
                                         right_forward_pin,
                                         right_encoder_feedback_pin_A,
                                         right_encoder_feedback_pin_B)

        # other
        #self._wheelsAxle_lock = threading.RLock() # race condition lock

    # STATE GETTERS
    """ Distance and speed are calculated by a mean of the feedback
        from the two motors """
    # distance
    def distance(self):
        l_dist = self._left_motor.distance()
        r_dist = self._right_motor.distance()
        return (l_dist + r_dist) * 0.5

    #speed
    def speed(self):
        l_speed = self._left_motor.speed()
        r_speed = self._right_motor.speed()
        return (l_speed + r_speed) * 0.5

    #direction
    def direction(self):
        l_dir = self._left_motor.direction()
        r_dir = self._right_motor.direction()
        if(l_dir == r_dir):
            return l_dir
        else:
            return 0

    # MOVEMENT
    """ Movement wrapper method 
        if time is specified and distance is not, control_time is called
        if distance is specified and time is not, control_distance is called
        if both distance and time are specified, control_velocity is called """
    def control(self, power_left=100, power_right=100, time_elapse=0, target_distance=0):
        if(time_elapse != 0 and target_distance == 0): # time
            self.control_time(power_left, power_right, time_elapse)
        elif(time_elapse == 0 and target_distance != 0): # distance
            self.control_distance(power_left, power_right, target_distance)
        else: # velocity
            self.control_velocity(time_elapse, target_distance)

    """ Motor time control allows the motors
        to run for a certain amount of time """
    def control_time(self, power_left=100, power_right=100, time_elapse=0):
        #self._wheelsAxle_lock.acquire() # wheelsAxle lock acquire

        # applying tension to motors
        self._left_motor.control(power_left)
        self._right_motor.control(power_right)
        self._is_moving = True

        # moving for desired time
        # fixed for direct control that uses time_elapse -1 and stops manually
        if(time_elapse > 0):
            sleep(time_elapse)
            self.stop()

    """ Motor distance control allows the motors
            to run for a certain amount of distance (mm) """
    def control_distance(self, power_left=100, power_right=100, target_distance=0):
        #self._wheelsAxle_lock.acquire() # wheelsAxle lock acquire
        self._is_moving = True

        # applying tension to motors
        self._left_motor.control(power_left)
        self._right_motor.control(power_right)

        #PID parameters
        # assuming that power_right is equal to power_left and that coderbot
        # moves at 11.5mm/s at full PWM duty cycle
        MAX_SPEED = 180
        TARGET_LEFT = (MAX_SPEED / 100) * power_left #velocity [mm/s]
        TARGET_RIGHT = (MAX_SPEED / 100) * power_right  # velocity [mm/s]

        # SOFT RESPONSE
        #KP = 0.04  #proportional coefficient
        #KD = 0.02  # derivative coefficient
        #KI = 0.005 # integral coefficient

        # MEDIUM RESPONSE
        KP = 0.2  #proportional coefficient
        KD = 0.1 # derivative coefficient
        KI = 0.02 # integral coefficient

        # STRONG RESPONSE
        #KP = 0.9   # proportional coefficient
        #KD = 0.05  # derivative coefficient
        #KI = 0.03  # integral coefficient

        SAMPLETIME = 0.1

        left_speed = TARGET_LEFT
        right_speed = TARGET_RIGHT

        left_derivative_error = 0
        right_derivative_error = 0
        left_integral_error = 0
        right_integral_error = 0

        power_left_norm = power_left
        power_right_norm = power_right
        # moving for certaing amount of distance
        while(abs(self.distance()) < target_distance):
            # PI controller
            if(self._left_motor.speed() > 10 and self._right_motor.speed() > 10):
                # relative error
                left_error = (TARGET_LEFT - self._left_motor.speed())/TARGET_LEFT*100.0
                right_error = (TARGET_RIGHT - self._right_motor.speed())/TARGET_RIGHT*100.0

                power_left = power_left_norm + (left_error * KP) + (left_derivative_error * KD) + (left_integral_error * KI)
                power_right  = power_left_norm + (right_error * KP) + (right_derivative_error * KD) + (right_integral_error * KI)
                #print("LEFT correction: %f" % (left_error * KP + left_derivative_error * KD + left_integral_error * KI))
                #print("RIGHT correction: %f" % (right_error * KP + right_derivative_error * KD + right_integral_error * KI))

                # conrispondent new power
                power_left_norm = max(min(power_left, 100), 0)
                power_right_norm =  max(min(power_right, 100), 0)

                #print("Left SPEED: %f" % (self._right_motor.speed()))
                #print("Right SPEED: %f" % (self._left_motor.speed()))
                #print("Left POWER: %f" % (right_power))
                #print("Right POWER: %f" % (left_power))
                #print("")
                print("ml:", int(self._right_motor.speed()), " mr: ", int(self._left_motor.speed()), 
                      " le:", int(left_error), " re: ", int(right_error), 
                      " ls: ", int(left_speed), " rs: ", int(right_speed), 
                      " lp: ", int(power_left), " rp: ", int(power_right))
 
                # adjusting power on each motors
                self._left_motor.adjust_power(power_left_norm)
                self._right_motor.adjust_power(power_right_norm)

                #print("Left error: %f" % (left_error))
                #print("Right error: %f"  % (right_error))
                #print("")

                left_derivative_error = left_error
                right_derivative_error = right_error
                left_integral_error += left_error
                right_integral_error += right_error

            # checking each SAMPLETIME seconds
            sleep(SAMPLETIME)


        # robot arrived
        self.stop()

    """ Motor speed control to travel given distance
        in given time adjusting power on motors 
        NOT very intuitive, idea has been postponed"""
    def control_velocity(self, time_elapse=0, target_distance=0):
        pass

    """ The stop function calls the two stop functions of the two
        correspondent motors. 
        Locks are automatically obtained """
    def stop(self):
        # stopping left and right motors
        self._left_motor.stop()
        self._right_motor.stop()

        # trying to fix distance different than zero after
        # wheels has stopped by re-resetting state after 0.5s

        self._left_motor.reset_state()
        self._right_motor.reset_state()

        # updating state
        self._is_moving = False
        # restoring callback
        #try:
        #    self._wheelsAxle_lock.release()
        #except RuntimeError as e:
        #    logging.error("error: " + str(e))
        #    pass

    # CALLBACK
    def cancel_callback(self):
        self._right_motor.cancel_callback()
        self._left_motor.cancel_callback()
